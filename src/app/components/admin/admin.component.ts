import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Country } from 'src/app/models/country';
import { Province } from 'src/app/models/province';
import { User } from 'src/app/models/user';
import { CountryService } from 'src/app/services/country.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { StatusService } from 'src/app/services/status.service';
import { DeliveryStatusService } from 'src/app/services/deliveryStatus.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  private suscripciones = new Subscription();
  user: User = new User();
  orders: any[] = [];
  provinces: Province[] = [];
  countrys: Country[] = [];
  status: any[] = [];
  deliveryStatus: any[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  formOrders = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    status: new FormControl(0),
  });
  formStatus = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    delivery_status : new FormControl(null, [Validators.required]),
  });


  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private provinceService: ProvinceService,
    private countryService: CountryService,
    private statusService: StatusService,
    private deliveryStatusService: DeliveryStatusService
  ) {}

  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    )
    this.suscripciones.add(
      this.provinceService.getProvinces().subscribe((data) => {
        this.provinces = data;
      })
    )
    this.suscripciones.add(
      this.countryService.getCountries().subscribe((data) => {
        this.countrys = data;
      })
    )
    this.suscripciones.add(
      this.getOrders()
    )
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: '¡Advertencia!',
      text: '¿Estás seguro de que deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesion',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/home']);
      }
    });
  }

  getOrders() {
    const today = new Date();
    const fromDate = this.formOrders.value.fromDate ? this.formOrders.value.fromDate : this.formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
    const toDate = this.formOrders.value.toDate ? this.formOrders.value.toDate : this.formatDate(today, true);
    const status = this.formOrders.value.status ?? 0;
    this.formOrders.patchValue({
      fromDate: fromDate,
      toDate: toDate
    })
    this.orderService.getAllOrders(this.currentPage, fromDate, toDate, status).subscribe(
      (data) => {
        console.log(data);
        this.orders = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  formatDate(date: Date, endOfDay: boolean = false): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hours = '00';
    let minutes = '00';
  
    if (endOfDay) {
      hours = '23';
      minutes = '59';
    }
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  orderBy(event: any) {
    const value = event.target.value;
    if(value === 'antiguo') {
      this.orders.reverse();
    } else if(value === 'reciente') {
      this.getOrders();
    } 
  }

  getTotal(index: number) {
    let total = 0;
    this.orders[index].orderDetails.forEach((product: any) => {
      total += product.quantity * product.price;
    })
    return total;
  }
  
  getProvince(provinceId: number) {
    const province = this.provinces.find(data => data.id === provinceId);
    return province ? province.province : '';
  }

  exportToExcel() {
    // Pedidos 
    const dataToExport = this.orders.map(order => ({
      'ID Pago': order.id_payment,
      'Estado': order.status,
      'Fecha': order.date,
      'Cliente': `${order.user.name} ${order.user.lastname}`,
      'Teléfono': order.user.phone,
      'Email': order.user.email,
      'Dirección': `${order.user.address}, ${this.getProvince(order.user.province)}, ${order.user.city}`,
      'Piso': order.user.floor,
      'Departamento': order.user.departament,
      'Envío': order.shipping,
      'Método de Pago': order.format_payment + ' | ' + order.format_method,
      'Total': this.getTotal(this.orders.indexOf(order))
    }));

    // Productos vendidos
    const productsToExport: any[] = [];
    this.orders.forEach(order => {
      order.orderDetails.forEach((detail: any) => {
        productsToExport.push({
          'ID Pago': order.id_payment,
          'Cliente': `${order.user.name} ${order.user.lastname}`,
          'Producto': detail.product.name,
          'Código': detail.product.code,
          'Categoría': detail.product.category,
          'Marca': detail.product.brand,
          'Cantidad': detail.quantity,
          'Precio': detail.price,
          'Total': detail.quantity * detail.price,
        });
      });
    });

    const worksheetOrders: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const worksheetProducts: XLSX.WorkSheet = XLSX.utils.json_to_sheet(productsToExport);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Pedidos': worksheetOrders, 'Productos': worksheetProducts },
      SheetNames: ['Pedidos', 'Productos']
    };

    // Generar archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Pedidos_y_Productos_Vendidos');
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}${new Date().getFullYear()}.xlsx`);
  }

  nextPage(): void {
    if(this.currentPage + 1 < this.totalPages){
      this.currentPage++;
      this.getOrders();
    }
    
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getOrders();
    }
  }
  onPageChange(event: any) {
    const selectedPage = parseInt(event.target.value, 10);
    this.goToPage(selectedPage);
  }
  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.getOrders();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i);
  }

  openModalOrder(id: number) {
    this.loadStatusAndDeliveryStatus().then(() => {
      const order = this.orders.find(order => order.id === id);
      if (order) {
        const id_status = this.status.find(status => status.status === order.status).id.toString();
        const id_delivery_status = this.deliveryStatus.find(status => status.delivery_status === order.delivery_status).id.toString();
        this.formStatus.patchValue({
          id: order.id,
          status: id_status,
          delivery_status: id_delivery_status
        });
      }
    });
  }

  updateOrder() {
    const id = this.formStatus.value.id ? this.formStatus.value.id : '';
    const id_status = this.formStatus.value.status ? this.formStatus.value.status : 0;
    const id_delivery_status = this.formStatus.value.delivery_status ? this.formStatus.value.delivery_status : 0;
    if(this.formStatus.valid && id_status > 0 && id_delivery_status > 0 && id !== '') {
      this.orderService.updateOrder(id, id_status, id_delivery_status).subscribe(data => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Pedido actualizado correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
        this.getOrders();
      })  
    }
  }
  
  loadStatusAndDeliveryStatus() {
    return Promise.all([
      this.statusService.getStatus().toPromise().then(data => {
        this.status = data;
      }),
      this.deliveryStatusService.getDeliveryStatus().toPromise().then(data => {
        this.deliveryStatus = data;
      })
    ]);
  }
}
