import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { User } from 'src/app/models/user';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/subCategory.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  constructor(private router: Router, 
    private userService: UserService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private subCategoryService: SubCategoryService) { }
  user:User = new User();
  categories: Category[] = [];
  brands: Brand[] = [];
  subCategories: SubCategory[] = [];
  subCategoriesByCategory: SubCategory[] = [];
  private suscripciones = new Subscription();
  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe(data => {
        this.user = data;
      })
    )
    this.loadBrands();
    this.loadCategories();
    this.loadSubCategories();
  }

  loadBrands() {
    this.suscripciones.add(
      this.brandService.getBrands().subscribe(
        (data) => {
          this.brands = data;
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  loadCategories() {
    this.suscripciones.add(
      this.categoryService.getCategories().subscribe(
        (data) => {
          this.categories = data;
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  loadSubCategories() {
    this.suscripciones.add(
      this.subCategoryService.getSubCategories().subscribe(
        (data) => {
          this.subCategories = data;
        },
        (error) => {
          console.log(error);
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  logout() {
    Swal.fire({
      title: '¡Advertencia!',
      text: '¿Estás seguro de que deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesion',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/home']);
      }
    });
  }

  editBrand(brand: Brand) {
    brand.editable = true;
  }
  
  editCategory(category: Category) {
    category.editable = true;
  }

  updateBrand(brand: Brand){
    this.brandService.updateBrand(brand.id, brand.brand).subscribe(
      (data) => {
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
          title: "Se actualizo la marca: " + brand.brand + " con exito"
        });
        this.loadBrands();
      },
      (error) => {
        console.log(error);
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
          title: "Error al actualizar, ya existe una marca con ese nombre"
        });
      }
    );
    brand.editable = false;
  }

  updateCategory(category: Category){
    this.categoryService.updateCategory(category.id, category.category).subscribe(
      (data) => {
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
          title: "Se actualizo la categoria: " + category.category + " con exito"
        });
        this.loadCategories();
      },
      (error) => {
        console.log(error);
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
          title: "Error al actualizar, ya existe una categoria con ese nombre"
        });
      }
    );
    category.editable = false;
  }

  updateSubCategory(subCategory: SubCategory){
    this.subCategoryService.updateSubCategory(subCategory.id, subCategory.subcategory).subscribe(
      (data) => {
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
          title: "Se actualizo la sub categoria: " + subCategory.subcategory + " con exito"
        });
        this.loadSubCategories();
      },
      (error) => {
        console.log(error);
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
          title: "Error al actualizar, ya existe una sub categoria con ese nombre"
        });
      }
    );
    subCategory.editable = false;
  }

  cancelBrand(brand: Brand) {
    brand.editable = false;
  }

  cancelCategory(category: Category) {
    category.editable = false;
  }

  cancelSubCategory(subCategory: SubCategory) {
    subCategory.editable = false;
  }

  loadModal(category: string){
    this.subCategoryService.getSubCategoriesByCategory(category).subscribe(
      (data) => {
      this.subCategoriesByCategory = data;
    })
  }

  editSubCategory(subCategory: SubCategory) {
    subCategory.editable = true;
  }

}
