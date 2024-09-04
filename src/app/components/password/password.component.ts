import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  constructor(private passwordService: PasswordService) { }

  loading: boolean = false;
  message: string = '';

  passwordRecover = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  
  ngOnInit() {
  }

  recoverPassword() {
    if(this.passwordRecover.valid) {
      this.loading = true;
      this.message = '';
      const email = this.passwordRecover.value.email || '';

      this.passwordService.recoverPassword(email).subscribe(
        (response: any) => {
          console.log(response);
          this.loading = false;
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
            title: "Se envió un correo para restablecer su contraseña."
          });
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
