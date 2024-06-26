import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createAccount',
  templateUrl: './createAccount.component.html',
  styleUrls: ['./createAccount.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private route: ActivatedRoute) { }
  message: string = '';
  ngOnInit() {
    this.route.params.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.verifyAccount.get('code')?.setValue(code);
      }
    });
  }
  verifyAccount = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(80)]),
  })

  verify() {
      this.loginService.verifyAccount(this.verifyAccount.value).subscribe(
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
            title: "Su cuenta ha sido verificada con éxito, por favor inicie sesión."
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.message = 'Error, no se pudo verificar su cuenta.';
        }
      );
    
  }
}
