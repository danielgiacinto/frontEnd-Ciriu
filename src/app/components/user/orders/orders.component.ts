import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private userService: UserService, 
    private router: Router) { }
  
  private suscripciones = new Subscription();
  user: User = new User();
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  orders: any[] = [];

  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe(data => {
        this.user = data;
      })
    )
    this.suscripciones.add(
      this.loadOrdersUser()
    )
  }

  loadOrdersUser(): void {
    this.userService.getOrdersByIdUser(this.currentPage, localStorage.getItem('user') || '').subscribe(data => {
      this.orders = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
    })
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  getTotal(index: number) {
    let total = 0;
    this.orders[index].orderDetails.forEach((product: any) => {
      total += product.quantity * product.price;
    })
    return total;
  }


  logout() {
    Swal.fire({
      title: 'Atencion',
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
  nextPage(): void {
    if(this.currentPage + 1 < this.totalPages){
      this.currentPage++;
      this.loadOrdersUser();
    }
    
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrdersUser();
    }
  }
  onPageChange(event: any) {
    const selectedPage = parseInt(event.target.value, 10);
    this.goToPage(selectedPage);
  }
  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.loadOrdersUser();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i);
  }

}
