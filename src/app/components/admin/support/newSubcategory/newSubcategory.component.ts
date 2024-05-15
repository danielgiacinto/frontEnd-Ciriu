import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/subCategory.service';

@Component({
  selector: 'app-newSubcategory',
  templateUrl: './newSubcategory.component.html',
  styleUrls: ['./newSubcategory.component.css']
})
export class NewSubcategoryComponent implements OnInit {

  constructor(private subCategory: SubCategoryService, private categoryService: CategoryService) { }
  categories: Category[] = [];
  formNewSubCategory = new FormGroup({
    id_category: new FormControl('', [Validators.required]),
    subcategory: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(){
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      }
    )
  }

  createSubCategory(){
    if(this.formNewSubCategory.valid){
      console.log(this.formNewSubCategory.value);
      this.subCategory.createSubCategory(this.formNewSubCategory.value).subscribe(
        data => {
          console.log(data);
          alert("Subcategoría añadida");
          this.formNewSubCategory.reset();
        },
        error => {
          alert("La subcategoría ya existe");
          this.formNewSubCategory.reset();
        }
      )
    }
  }

}
