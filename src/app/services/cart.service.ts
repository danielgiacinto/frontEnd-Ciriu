import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() { 
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartSubject.next(cart);
  }

  public openCart(): void {
    this.cartOpenSubject.next(true);
  }

  public closeCart(): void {
    this.cartOpenSubject.next(false);
  }
  isCartOpen(): Observable<boolean> {
    return this.cartOpenSubject.asObservable();
  }

  addToCart(product: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProduct = cart.find((p: any) => p.code === product.code);
    if(existingProduct) {
      Swal.fire({
        icon: 'error',
        title: 'El producto ya existe en el carrito',
      })
    } else {
      product.quantity = 1;
      cart.push(product);
      this.openCart();
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Emitir el nuevo estado del carrito
    this.cartSubject.next(cart);
  }

  removeCart(product: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex((p: any) => p.code === product.code);
    if(index !== -1) {
      cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // Emitir el nuevo estado del carrito
    this.cartSubject.next(cart);
  }

  quantityCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.length
  }

  updateCart(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.emitCartUpdate(cart);
  }
  private emitCartUpdate(cart: any[]) {
    this.cartSubject.next(cart);
  }
}
