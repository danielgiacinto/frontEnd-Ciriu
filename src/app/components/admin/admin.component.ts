import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, finalize } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { Country } from 'src/app/models/country';
import { Province } from 'src/app/models/province';
import { User } from 'src/app/models/user';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { CountryService } from 'src/app/services/country.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { ToyService } from 'src/app/services/toy.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
  formOrders = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    status: new FormControl(0),
  });

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private provinceService: ProvinceService,
    private countryService: CountryService
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
    this.getOrders();
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
    this.orderService.getAllOrders(fromDate, toDate, status).subscribe(
      (data) => {
        console.log(data);
        this.orders = data;
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
  

  
}
