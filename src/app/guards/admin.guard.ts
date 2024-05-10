import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const rol = localStorage.getItem('rol');
  const user = localStorage.getItem('user');

  if (rol === 'Administrador' && user !== null) {
    return userService.getInfo().pipe(
      map(data => {
        if (data) {
          return true;
        } else {
          router.navigate(['/login']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error fetching user info:', error);
        router.navigate(['/login']);
        return of(false);
      })
    );
  } else {
    router.navigate(['/home']);
    return false;
  }

};
