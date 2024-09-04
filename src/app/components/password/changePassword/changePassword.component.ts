import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from 'src/app/models/resetPassword';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private passwordService: PasswordService,private router: Router, private route: ActivatedRoute) { }
  message: string = '';
  resetPassword = new ResetPassword();

  changePassword = new FormGroup({
    token: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  ngOnInit() {
    this.changePassword.get('repeatPassword')?.setValidators(this.passwordMatchValidator.bind(this));
    this.route.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.changePassword.get('token')?.setValue(token);
      }
    });
  }


  change() {
    if(this.changePassword.valid){
        this.resetPassword.newPassword = this.changePassword.get('newPassword')?.value || '';
        this.resetPassword.token = this.changePassword.get('token')?.value || '';
        this.passwordService.changePassword(this.resetPassword).subscribe(
          (response: any) => {
            console.log(response);
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Su contraseña ha sido cambiada exitosamente, inicie sesión nuevamente."
            });
            this.router.navigate(['/login']);
          },
          (error) => {
            console.log(error);
            this.message = error.error.message;
          }
        )
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = this.changePassword.get('newPassword')?.value;
    const repeatPassword = control.value;
    if (password === repeatPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }
}
