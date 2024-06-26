import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  loading: boolean = false;
  acceptTerms: boolean = false;
  message: string = '';
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.signUpForm.get('passwordSignUp')?.valueChanges.subscribe(() => {
      this.signUpForm.get('repeatPasswordSignUp')?.updateValueAndValidity();
    });
    this.signUpForm.get('repeatPasswordSignUp')?.setValidators(this.passwordMatchValidator.bind(this));
  }

  signUpForm = new FormGroup({
    nameSignUp: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]),
    lastnameSignUp: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]),
    emailSignUp: new FormControl('', [Validators.required, Validators.email]),
    passwordSignUp: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatPasswordSignUp: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  signUp() {
    if(this.signUpForm.valid && this.acceptTerms) {
      this.loading = true;
      this.loginService.createAccount(this.signUpForm.value).subscribe(
        (response: any) => {
          console.log(response);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Se envió un código a tu correo para confirmar tu cuenta"
          });
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

  changeTerms(){
    this.acceptTerms = !this.acceptTerms;
    console.log(this.acceptTerms);

  }

  passwordMatchValidator(control: AbstractControl) {
    const password = this.signUpForm.get('passwordSignUp')?.value;
    const repeatPassword = control.value;
    if (password === repeatPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

}
