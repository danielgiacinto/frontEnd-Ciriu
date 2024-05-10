import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createAccount',
  templateUrl: './createAccount.component.html',
  styleUrls: ['./createAccount.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }
  verifyAccount = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(80)]),
  })

  verify() {
      this.loginService.verifyAccount(this.verifyAccount.value).subscribe(
        (response: any) => {
          console.log(response);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Su cuenta ha sido verificada con éxito",
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error, no se pudo verificar la cuenta",
            showConfirmButton: false,
            timer: 2000
          })
        }
      );
    
  }
}
