import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  viewCart: boolean = false;
  rutaActual = '';
  quantityCart = 0;
  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.quantityCart = cart.length
    })
    this.cartService.isCartOpen().subscribe(isOpen => {
      this.viewCart = isOpen;
    });
  }

  openCart(): void {
    this.cartService.openCart();
  }

  isCheckoutRoute(): boolean {
    return this.router.url.includes('/checkout') || this.router.url.includes('/checkout/payment');
  }

  redirectToRoleSpecificComponent() {
    const rol = localStorage.getItem('rol');
    if (rol === 'Administrador') {
      this.router.navigate(['/admin/orders']); 
    } else if (rol === 'Usuario') {
      this.router.navigate(['/user/info']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  
}
