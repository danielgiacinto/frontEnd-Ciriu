import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../services/login.service';

export const checkoutUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const loginService = inject(LoginService);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    router.navigate(['/login']);
    return of(false);
  }

  return loginService.validateToken().pipe(
    switchMap(() => {
      // Si el token es válido, verificamos el rol
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.rol === 'Usuario' || decodedToken.rol === 'Administrador' && user !== null) {
        // Verificamos la información del usuario
        return userService.getInfo().pipe(
          map(data => {
            if (data) {
              return true; // Permitir acceso
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
        router.navigate(['/']);
        return of(false); // Redirigir si no es administrador
      }
    }),
    catchError(error => {
      console.error('Token inválido o expirado:', error);
      router.navigate(['/login']); // Redirigir si el token no es válido
      return of(false);
    })
  );

};
