import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';

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
          alert("Categoría añadida");
          this.formNewCategory.reset();
        },
        error => {
          alert("La categoría ya existe");
          this.formNewCategory.reset();
        }
      )
    }
  }

}
