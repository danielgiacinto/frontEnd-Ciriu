import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Toy } from 'src/app/models/Toy';
import { Order, OrderDetail } from 'src/app/models/order';
import { CartService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private router: Router) { }
  cart : Toy[] = [];
  viewCart: boolean = true;
  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart.map(item => {
        if (!item.quantity) {
          item.quantity = 1;
        }
        return item;
      });
    });
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  removeItem(item: Toy) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: '¿Estas seguro que deseas eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeCart(item);
      }
    })
  }

  increaseQuantity(item: Toy) {
    if(item.quantity < item.stock){
      item.quantity++;
      this.updateCart();
    }
  }

  decreaseQuantity(item: Toy) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart)); // Actualizar el carrito en localStorage
    this.cartService.updateCart(this.cart); // Emitir el nuevo estado del carrito
  }

  getTotal(): string|number {
    let total = 0;
    this.cart.forEach((toy: Toy) => {
      total += toy.price * toy.quantity;
    });
    return total;
  }
  
  goToCheckout() {
    if(this.cart.length > 0){
      this.cartService.closeCart();
      this.router.navigate(['/checkout']);
      
    }
  }
   
}




