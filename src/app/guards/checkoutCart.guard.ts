import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';
import { CartService } from '../services/cart.service';

export const checkoutCartGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const rol = localStorage.getItem('rol');
  const user = localStorage.getItem('user');

  if (rol === 'Administrador' || rol === 'Usuario' && user !== null) {
    return cartService.cart$.pipe(
      map(cart => {
        if (cart.length > 0) { // Verifica si hay productos en el carrito
          return true; // Permite la navegación si hay productos en el carrito
        } else {
          router.navigate(['/products']); // Si no hay productos, redirige al usuario a la página de productos
          return false;
        }
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        router.navigate(['/products']); // Si hay algún error, redirige al usuario a la página de productos
        return of(false);
      })
    );
  } else {
    router.navigate(['/login']); // Si el usuario no tiene un rol adecuado, redirige al usuario a la página de inicio de sesión
    return of(false);
  }

};
