import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrandService } from 'src/app/services/brand.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newBrand',
  templateUrl: './newBrand.component.html',
  styleUrls: ['./newBrand.component.css']
})
export class NewBrandComponent implements OnInit {

  constructor(private brandService: BrandService) { }
  formNewBrand = new FormGroup({
    brand: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  ngOnInit() {
  }

  createBrand(){
    if(this.formNewBrand.valid){
      console.log(this.formNewBrand.value);
      this.brandService.createBrand(this.formNewBrand.value).subscribe(
        data => {
          console.log(data);
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
            title: "Se registro la marca con exito"
          });
          this.formNewBrand.reset();
          this.brandService.notifyBrandUpdated();
        },
        error => {
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
            icon: "error",
            title: "Error, ya existe una marca con ese nombre"
          });
          this.formNewBrand.reset();
        }
      )
    }
  }

}
