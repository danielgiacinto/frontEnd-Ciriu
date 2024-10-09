import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, every, finalize } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { User } from 'src/app/models/user';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/subCategory.service';
import { ToyService } from 'src/app/services/toy.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productsAdmin',
  templateUrl: './productsAdmin.component.html',
  styleUrls: ['./productsAdmin.component.css'],
})
export class ProductsAdminComponent implements OnInit {
  private suscripciones = new Subscription();
  toys: Toy[] = [];
  currentPage: number = 0;
  sortBy: string = '';
  searchTerm: string = '';
  nonStock: Boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;
  user: User = new User();
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  subCategoriesEdit: SubCategory[] = [];
  brands: Brand[] = [];
  previewUrl: string | undefined;
  guardandoCambios: boolean = false;
  codeUpdate: string = '';

  formNewToy = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      this.validateToyCode.bind(this),
    ]),
    category: new FormControl('', [Validators.required]),
    subcategory: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(9999999),
    ]),
    brand: new FormControl(''),
    stock: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(999),
    ]),
    image: this.formBuilder.array([this.formBuilder.control('')]),
  });

  formEditToy = new FormGroup({
    nameEdit: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    categoryEdit: new FormControl('', [Validators.required]),
    subcategoryEdit: new FormControl('', [Validators.required]),
    descriptionEdit: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),
    priceEdit: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(9999999),
    ]),
    brandEdit: new FormControl(''),
    imageEdit: this.formBuilder.array([this.formBuilder.control('')]),
  });

  constructor(
    private toyService: ToyService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.suscripciones.add(
      this.loadToys()
    )
    this.suscripciones.add(
      this.loadCategories()
    );
    this.suscripciones.add(
      this.loadBrands()
    );
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    );
    this.suscripciones.add(
      this.subCategoryService.getSubCategories().subscribe((data) => {
        this.subCategoriesEdit = data;
      })
    )
    this.brandService.brandUpdated$.subscribe(() => {
      this.loadBrands();
    })
    this.categoryService.categoryUpdated$.subscribe(() => {
      this.loadCategories();
    })
    this.subCategoryService.subCategoryUpdated$.subscribe(() => {
      
    })
  }

  loadToys(): void {
    this.suscripciones.add(
      this.toyService
        .getToys(
          this.currentPage,
          this.sortBy,
          this.searchTerm,
          this.nonStock,
          '',
          ''
        )
        .subscribe(
          (response) => {
            console.log(response);
            this.totalPages = response.totalPages;
            this.toys = response.content;
            this.totalElements = response.totalElements;
            console.log(this.totalPages);
            console.log(this.currentPage);
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  loadBrands() {
    // Método para cargar todas las marcas desde el servicio
    this.brandService.getBrands().subscribe(
      (data: any) => {
        this.brands = data;  // Actualizar la lista de marcas
      },
      (error) => {
        console.error('Error al cargar marcas', error);
      }
    );
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }


  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadToys();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadToys();
    }
  }
  onPageChange(event: any) {
    const selectedPage = parseInt(event.target.value, 10);
    this.goToPage(selectedPage);
  }
  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.router.navigate(['/admin/products'], {
      queryParams: { page: this.currentPage },
    });
    this.loadToys();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i);
  }

  orderProducts(event: any) {
    this.router.navigate(['/admin/products']);
    this.sortBy = event.target.value;
    this.loadToys();
  }

  searchProducts(event: any) {
    this.searchTerm = event.target.value;
    this.loadToys();
  }

  filterByNonStock(event: any) {
    console.log(event.target.checked);
    this.nonStock = event.target.checked;
    this.loadToys();
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  async newToy() {
    if (this.formNewToy.valid) {
      console.log(this.formNewToy.value);
      this.guardandoCambios = true;
      this.toyService.postToy(this.formNewToy.value).subscribe(
        (data) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Producto creado con éxito"
          });
          this.formNewToy.reset();
          this.loadToys();
        },
        (error) => {
          console.log(error);
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
            icon: "error",
            title: error.error.message
          });
        }
      );
      this.guardandoCambios = false;
    }
  }

  // uploadFile(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage = file;
  //   }
  // }

  // private saveToy(imageURL: string) {
  //   const toyData = { ...this.formNewToy.value, image: imageURL };
  //   this.toyService.postToy(toyData).subscribe(
  //     (data) => {
  //       this.formNewToy.reset();
  //       this.previewUrl = '';
  //       this.loadToys();
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   this.guardandoCambios = false;
  // }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    let category = '';
    this.categories.forEach((cat) => {
      if (cat.id == categoryId) {
        category = cat.category;
      }
    });
    console.log(category);
    if (category) {
      this.loadSubCategoriesSelect(category);
    } else {
      this.subCategories = [];
    }
  }

  loadSubCategoriesSelect(category: string) {
    this.subCategoryService
      .getSubCategoriesByCategory(category)
      .subscribe((data) => {
        this.subCategories = data;
      });
  }

  deleteProduct(code: string) {
    Swal.fire({
      title: '¿Estas seguro que quieres eliminar el producto?',
      text: 'Quedara alojado en la papelera y no aparecera en el catálogo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.toyService.deleteProduct(code).subscribe(
          (data) => {
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
              title: "Producto eliminado con éxito",
            });
            this.loadToys();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  showPreview(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateToyCode(control: FormControl): { [key: string]: any } | null {
    const code = control.value;
    if (this.toys.some((toy) => toy.code === code)) {
      return { codeExists: true };
    }
    return null;
  }

  clearForm() {
    this.formNewToy.reset();
    this.previewUrl = '';
  }

  getToyEdit(code: string) {
    this.toyService.getToyByCode(code).subscribe(
      (data) => {
        const categoryId = this.categories
          .find((category) => category.category === data.category)
          ?.id.toString();
        this.onCategoryChange({ target: { value: categoryId } });
        const brandId = this.brands
          .find((brand) => brand.brand === data.brand)
          ?.id.toString();
        const subCategoryId = this.subCategoriesEdit
          .find((sub) => sub.subcategory === data.subcategory)
          ?.id.toString();
        this.formEditToy.patchValue({
          nameEdit: data.name,
          categoryEdit: categoryId,
          subcategoryEdit: subCategoryId,
          descriptionEdit: data.description,
          brandEdit: brandId,
          priceEdit: data.price,
        });
        const imagesArray = this.formEditToy.get('imageEdit') as FormArray;
        imagesArray.clear();
        data.image.forEach((imageUrl: string) => {
          imagesArray.push(new FormControl(imageUrl));
        });
        this.codeUpdate = data.code;
      },
      (error) => {
        console.log(error);
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
          icon: "error",
          title: error.error.message
        });
      }
    );
  }

  editToy() {
    if (this.formEditToy.valid) {
      console.log(this.formEditToy.value);
      this.guardandoCambios = true;
      const toyData = {
        name: this.formEditToy.value.nameEdit,
        category: this.formEditToy.value.categoryEdit,
        sub_category: this.formEditToy.value.subcategoryEdit,
        description: this.formEditToy.value.descriptionEdit,
        brand: this.formEditToy.value.brandEdit,
        price: this.formEditToy.value.priceEdit,
        image: this.formEditToy.value.imageEdit,
      };
      this.toyService.updateProduct(this.codeUpdate, toyData).subscribe(
        (data) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Producto actualizado con éxito"
          });
          console.log(data);
          this.loadToys();
        },
        (error) => {
          console.log(error);
        }
      );
      this.guardandoCambios = false;
    }
  }

  getFileName(url: string): string {
    const indiceSignoPregunta = url.indexOf('?');
    if (indiceSignoPregunta !== -1) {
      return url.substring(0, indiceSignoPregunta);
    } else {
      return url;
    }
  }

  updateProductAndReload(code: string, toyData: any) {
    this.toyService.updateProduct(code, toyData).subscribe(
      (data) => {
        Swal.fire({
          title: 'Producto actualizado con éxito!',
          text: 'Se actualizo el producto correctamente!',
          icon: 'success',
        });
        console.log(data);
        this.loadToys();
      },
      (error) => {
        console.log(error);
      }
    );
    this.guardandoCambios = false;
  }

  get images() {
    return this.formNewToy.get('image') as FormArray;
  }

  get imagesEdit() {
    return this.formEditToy.get('imageEdit') as FormArray;
  }

  addImage() {
    this.images.push(this.formBuilder.control(''));
  }

  addImageEdit() {
    this.imagesEdit.push(this.formBuilder.control(''));
  }

  removeImage(index: number) {
    if (this.images.length > 1) {
      this.images.removeAt(index);
    }
  }

  removeImageEdit(index: number) {
    if (this.imagesEdit.length > 1) {
      this.imagesEdit.removeAt(index);
    }
  }
}
