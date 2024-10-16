import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {

  loading: boolean = false;
  message: string = '';

  constructor(private loginService: LoginService, private router: Router, private userService: UserService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });


  ngOnInit() {}

  login() {
    if(this.loginForm.valid) {
      this.loading = true;
      this.loginService.loginUser(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('user', response.id);
          localStorage.setItem('token', response.token);
          const decodedToken: any = jwtDecode(response.token);
          this.userService.setRole(decodedToken.rol);
          
          if (decodedToken.rol === 'Administrador') {
            this.router.navigate(['/admin/orders']);
          } else if (decodedToken.rol === 'Usuario') {
            this.router.navigate(['/user/info']);
          }
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.message = error.error.message;
          this.loading = false;
        }
      );
    }
  }



}
