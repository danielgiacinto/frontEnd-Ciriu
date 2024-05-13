import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { SubCategory } from 'src/app/models/subCategory';
import { BrandService } from 'src/app/services/brand.service';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/subCategory.service';
import { ToyService } from 'src/app/services/toy.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(
    private toyService: ToyService,
    private brandService: BrandService, 
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router) { }
    
  suscripciones = new Subscription();
  toys: Toy[] = [];
  currentPage: number = 0;
  sortBy:string = '';
  searchTerm: string = '';
  totalPages: number = 0;
  totalElements: number = 0;
  category: string = '';
  brand: string = '';
  viewClearFilter: boolean = false;
  brands: Brand[] = [];
  subcategories: SubCategory[] = [];
  categories: Category[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page'] || '0', 10);
      this.searchTerm = params['searchTerm'] || '';
      this.sortBy = params['sortBy'] || 'default';
      this.category = params['category'] || '';
      this.brand = params['brand'] || '';
      this.loadBrands();
      this.loadCategories();
      this.loadSubCategories();
      this.loadToys();
    });
  }

  loadToys(): void {
    this.suscripciones.add(
      this.toyService.getToys(this.currentPage, this.sortBy, this.searchTerm, false, this.category, this.brand).subscribe(
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

  loadBrands(): void {
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

  loadCategories(): void {
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

  loadSubCategories(): void {
    this.suscripciones.add(
      this.subCategoryService.getSubCategories().subscribe(
        (data) => {
          this.subcategories = data;
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }


  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
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

  getSubCategoriesByCategory(category: string): SubCategory[] {
    return this.subcategories.filter(subCategory => subCategory.category === category);
  }

  filterByCategory(category: string){
    this.router.navigate(['/products'], { queryParams: { category: category } });
    this.category = category;
    this.loadToys();
    this.viewClearFilter = true;
  }

  filterByBrand(brand: string){
    this.router.navigate(['/products'], { queryParams: { brand: brand } });
    this.brand = brand;
    this.loadToys();
    this.viewClearFilter = true;
  }

  searchProducts(event: any) {
    this.router.navigate(['/products'], { queryParams: { searchTerm: event.target.value } });
    this.searchTerm = event.target.value;
    this.loadToys();
    this.viewClearFilter = true;
  }

  clearFilters() {
    this.category = '';
    this.brand = '';
    this.searchTerm = '';
    this.router.navigate(['/products']);
    this.loadToys();
    this.viewClearFilter = false;
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  addToCart(toy: any) {
    this.cartService.addToCart(toy);
  }

  orderProducts(event: any) {
    this.router.navigate(['/products'], { queryParams: { sortBy: event.target.value } });
    this.sortBy = event.target.value;
    this.loadToys();
  }


}
