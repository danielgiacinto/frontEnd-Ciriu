import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const checkoutPaymentGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const rol = localStorage.getItem('rol');
  const user = localStorage.getItem('user');

  if (rol === 'Administrador' || (rol === 'Usuario' && user !== null)) {
    return userService.updateSuccess().pipe(
      map((data) => {
        if (data) {
          return true;
        } else {
          router.navigate(['/checkout']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error fetching user info:', error);
        router.navigate(['/checkout']);
        return of(false);
      })
    );
  } else {
    router.navigate(['/checkout']);
    return of(false);
  }

};
