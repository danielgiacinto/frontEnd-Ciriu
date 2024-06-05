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
    acceptTerms: new FormControl(false, [Validators.requiredTrue]),
  })

  signUp() {
    if(this.signUpForm.valid) {
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
            title: "Se envio un codigo al email de confirmacion"
          });
          this.loading = false;
        },
        (error) => {
          console.log(error);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error, no se pudo crear la cuenta",
            showConfirmButton: false,
            timer: 3000
          });
          this.loading = false;
        }
      );
    }
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
