import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  viewCart: boolean = false;
  rutaActual = '';
  quantityCart = 0;
  rol: string | null = '';
  constructor(private router: Router, private cartService: CartService, private userService: UserService) {}

  ngOnInit(): void {
    this.onWindowScroll();
    this.cartService.cart$.subscribe(cart => {
      this.quantityCart = cart.length
    })
    this.cartService.isCartOpen().subscribe(isOpen => {
      this.viewCart = isOpen;
    });
    this.userService.role$.subscribe(role => {
      this.rol = role;
    });
  }
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.getElementById('navbar') as HTMLElement;
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  isCheckoutRoute(): boolean {
    return this.router.url.includes('/checkout') || this.router.url.includes('/checkout/payment');
  }

  checkRol() {
    this.rol = localStorage.getItem('rol') || '';
    console.log(this.rol);
  }

  logout() {
    Swal.fire({
      title: 'Atención',
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

  
}
