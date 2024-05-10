import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, finalize } from 'rxjs';
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
  oldImage: string = '';
  selectedImage: File | null = null;
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
    sub_category: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(999999),
    ]),
    brand: new FormControl('', [Validators.required]),
    stock: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(999),
    ]),
    image: this.formBuilder.array([this.formBuilder.control('')]),
  });

  formEditToy = new FormGroup({
    nameEdit: new FormControl('', [Validators.required, Validators.minLength(3)]),
    categoryEdit: new FormControl('', [Validators.required]),
    sub_categoryEdit: new FormControl('', [Validators.required]),
    descriptionEdit: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    priceEdit: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(999999),
    ]),
    brandEdit: new FormControl('', [Validators.required]),
    imageEdit: this.formBuilder.array([this.formBuilder.control('')]),
  });

  constructor(
    private toyService: ToyService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private storage: AngularFireStorage,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = parseInt(params['page'] || '0', 10);
      this.loadToys();
    });
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
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    );
    this.suscripciones.add(
      this.subCategoryService.getSubCategories().subscribe((data) => {
        this.subCategoriesEdit = data;
      })
    );
  }

  loadToys(): void {
    this.suscripciones.add(
      this.toyService
        .getToys(this.currentPage, this.sortBy, this.searchTerm, this.nonStock, '', '')
        .subscribe(
          (response) => {
            console.log(response);
            this.totalPages = response.totalPages;
            this.toys = response.content;
            this.totalElements = response.totalElements;
          },
          (error) => {
            console.log(error);
          }
        )
    );
  }

  nextPage(): void {
    this.currentPage++;
    this.loadToys();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadToys();
    }
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
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
        this.router.navigate(['/home']);
      }
    });
  }

  async newToy() {
    if (this.formNewToy.valid) {
      console.log(this.formNewToy.value);
      this.guardandoCambios = true;
      this.toyService.postToy(this.formNewToy.value).subscribe(
        (data) => {
          Swal.fire({
            title: 'Producto creado con exito!',
            text: 'Se agrego correctamente a el catálogo!',
            icon: 'success',
          });
          this.formNewToy.reset();
          this.loadToys();
        },
        (error) => {
          console.log(error);
        }
      );
      this.guardandoCambios = false;
      // const file = this.selectedImage;
      // if (!file) {
      //   console.error('No se ha seleccionado ningún archivo.');
      //   return;
      // }

      // const fileName = Date.now().toString() + '_' + file.name;
      // const fileRef = this.storage.ref(fileName);

      // try {
      //   const uploadTask = await fileRef.put(file);
      //   const downloadURL = await uploadTask.ref.getDownloadURL();
      //   this.saveToy(downloadURL); // Guardar detalles del juguete y URL de la imagen
      // } catch (error) {
      //   console.error('Error al subir la imagen:', error);
      // }
    }
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  private saveToy(imageURL: string) {
    const toyData = { ...this.formNewToy.value, image: imageURL };
    this.toyService.postToy(toyData).subscribe(
      (data) => {
        Swal.fire({
          title: 'Producto creado con exito!',
          text: 'Se agrego correctamente a el catálogo!',
          icon: 'success',
        });
        this.formNewToy.reset();
        this.previewUrl = '';
        this.loadToys();
      },
      (error) => {
        console.log(error);
      }
    );
    this.guardandoCambios = false;
  }

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
        console.log(this.subCategories);
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
            Swal.fire({
              title: 'Producto eliminado con éxito!',
              text: 'Se elimino y esta alojado en la papelera!',
              icon: 'success',
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
    this.selectedImage = null;
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
          .find((sub) => sub.sub_category === data.sub_category)
          ?.id.toString();
        this.formEditToy.patchValue({
          nameEdit: data.name,
          categoryEdit: categoryId,
          sub_categoryEdit: subCategoryId,
          descriptionEdit: data.description,
          brandEdit: brandId,
          priceEdit: data.price,
        });
        const imagesArray = this.formEditToy.get('imageEdit') as FormArray;
        imagesArray.clear();
        data.image.forEach((imageUrl: string) => {
          imagesArray.push(new FormControl(imageUrl));
        });
        //this.previewUrl = data.image;
        //this.oldImage = data.image;
        this.codeUpdate = data.code;
      },
      (error) => {
        console.log(error);
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
        sub_category: this.formEditToy.value.sub_categoryEdit,
        description: this.formEditToy.value.descriptionEdit,
        brand: this.formEditToy.value.brandEdit,
        price: this.formEditToy.value.priceEdit,
        image: this.formEditToy.value.imageEdit
      };
      this.toyService.updateProduct(this.codeUpdate, toyData).subscribe(
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
  }

  deleteImageFromStorage(imageUrl: string): Promise<void> {
    const filename = this.getFileName(imageUrl);
    const fileRef = this.storage.refFromURL(filename);
    return fileRef.delete().toPromise();
  }

  getFileName(url: string): string {
    const indiceSignoPregunta = url.indexOf('?');
    if (indiceSignoPregunta !== -1) {
      return url.substring(0, indiceSignoPregunta);
    } else {
      return url;
    }
  }

  uploadNewImage(image: File): Promise<string> {
    const fileName = Date.now().toString() + '_' + image.name;
    const fileRef = this.storage.ref(fileName);
    const uploadTask = fileRef.put(image);
    return new Promise<string>((resolve, reject) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(
              (url) => {
                resolve(url);
              },
              (error) => {
                reject(error);
              }
            );
          })
        )
        .subscribe();
    });
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


  addImage(){
    this.images.push(this.formBuilder.control(''));
  }

  addImageEdit(){
    this.imagesEdit.push(this.formBuilder.control(''));
  }


  removeImage(index: number) {
    if(this.images.length > 1){
      this.images.removeAt(index);
    }
  }

  removeImageEdit(index: number) {
    if(this.imagesEdit.length > 1){
      this.imagesEdit.removeAt(index);
    }
  }

}
