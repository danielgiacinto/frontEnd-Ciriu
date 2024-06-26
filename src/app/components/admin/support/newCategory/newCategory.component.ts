import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newCategory',
  templateUrl: './newCategory.component.html',
  styleUrls: ['./newCategory.component.css']
})
export class NewCategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService) { }
  formNewCategory = new FormGroup({
    category: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  ngOnInit() {
  }

  createCategory(){
    if(this.formNewCategory.valid){
      console.log(this.formNewCategory.value);
      this.categoryService.createCategory(this.formNewCategory.value).subscribe(
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
            title: "Se agrego la categoria con exito"
          });
          this.formNewCategory.reset();
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
            title: "Error, la categoria ya existe"
          });
          this.formNewCategory.reset();
        }
      )
    }
  }

}
