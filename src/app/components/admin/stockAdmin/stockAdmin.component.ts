import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { User } from 'src/app/models/user';
import { StockService } from 'src/app/services/stock.service';
import { ToyService } from 'src/app/services/toy.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stockAdmin',
  templateUrl: './stockAdmin.component.html',
  styleUrls: ['./stockAdmin.component.css']
})
export class StockAdminComponent implements OnInit {

  constructor(private router: Router, 
    private userService: UserService, 
    private stockService: StockService,
    private toyService : ToyService) { }

  user:User = new User();
  movements:any = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  product = new Toy();
  message: string = '';
  private suscripciones = new Subscription();
  formMovements = new FormGroup({
    date: new FormControl(this.getCurrentDateTime(), [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    movement: new FormControl('', [Validators.required]),
    code_product: new FormControl('', [Validators.required]),
  });
  formSearchStock = new FormGroup({
    fromDateSearch: new FormControl('',),
    toDateSearch: new FormControl('',),
    movementSearch: new FormControl('',),
  })

  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe(data => {
        this.user = data;
      })
    )
    this.suscripciones.add(
      this.loadMovements()
    )
  }

  loadMovements() : void {
    const today = new Date();
    const fromDate = this.formSearchStock.value.fromDateSearch ? this.formSearchStock.value.fromDateSearch : this.formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
    const toDate = this.formSearchStock.value.toDateSearch ? this.formSearchStock.value.toDateSearch : this.formatDate(today, true);
    const movement = this.formSearchStock.value.movementSearch ?? '';
    this.formSearchStock.patchValue({ fromDateSearch: fromDate, toDateSearch: toDate, movementSearch: movement });
    console.log(fromDate, toDate, movement);
    this.stockService.getMovements(this.currentPage, fromDate, toDate, movement).subscribe(data => {
      this.movements = data.content;
      console.log(this.movements);
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
    })
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/home']);
      }
    });
  }

  registerMovement(){
    if(this.formMovements.valid){
      console.log(this.formMovements.value);
      this.stockService.createMovement(this.formMovements.value).subscribe(data => {
        console.log(data);
        this.loadMovements();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Se registro el movimiento con éxito"
        });
      }, error => {
        this.message = error.error.message;
        console.log(error);
      })
    }
  }

  orderBy(event: any) {
    const value = event.target.value;
    if(value === 'antiguo') {
      this.movements.reverse();
    } else if(value === 'reciente') {
      this.loadMovements();
    }
  }

  viewProduct(code: string) {
    this.toyService.getToyByCode(code).subscribe(data => {
      this.product = data;
    })
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  nextPage(): void {
    if(this.currentPage + 1 < this.totalPages){
      this.currentPage++;
      this.loadMovements();
    }
    
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMovements();
    }
  }
  onPageChange(event: any) {
    const selectedPage = parseInt(event.target.value, 10);
    this.goToPage(selectedPage);
  }
  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadMovements();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i);
  }

}
