import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { CartService } from '../services/cart.service';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../services/login.service';

export const checkoutCartGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cartService = inject(CartService);
  const loginService = inject(LoginService);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    router.navigate(['/login']);
    return of(false);
  }

  return loginService.validateToken().pipe(
    switchMap(isValid => {
      if (isValid) { // Comprueba si el token es válido
        const decodedToken: any = jwtDecode(token);

        // Verifica el rol del usuario
        if (decodedToken.rol === 'Usuario' || decodedToken.rol === 'Administrador') {
          // Verifica el carrito
          return cartService.cart$.pipe(
            map(cart => {
              if (cart.length > 0) {
                return true;
              } else {
                router.navigate(['/products']);
                return false;
              }
            }),
            catchError(error => {
              console.error('Error al obtener el carrito:', error);
              router.navigate(['/products']);
              return of(false);
            })
          );
        } else {
          router.navigate(['/']);
          return of(false);
        }
      } else {
        router.navigate(['/login']);
        return of(false);
      }
    }),
    catchError(error => {
      console.error('Token inválido o expirado:', error);
      router.navigate(['/login']); // Redirigir si el token no es válido
      return of(false);
    })
  );

};
