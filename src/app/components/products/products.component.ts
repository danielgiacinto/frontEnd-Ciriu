import { Component, HostListener, OnInit } from '@angular/core';
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
  originalImage: string = '';
  categoryToy: boolean = false;

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
      this.viewClearFilter = this.existFilters();
    });
    this.calculateVisibleCards();
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

  existFilters() : boolean {
    if(this.category != '' || this.brand != '' || this.searchTerm != '') {
      return true;
    } else {
      return false;
    }
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

  loadReelToy(): boolean {
    if (this.category && this.subcategories.length > 0) {
      for (let subCategory of this.subcategories) {
        if (subCategory.category.toLowerCase() === 'juguetería' && subCategory.subcategory.toLowerCase() === this.category.toLowerCase() || this.category === 'juguetería') {
          return true;
        }
      }
    }
    return false;
  }
  
  loadSubCategories(): void {
    this.suscripciones.add(
      this.subCategoryService.getSubCategories().subscribe(
        (data) => {
          this.subcategories = data;
          this.categoryToy = this.loadReelToy();
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
  onPageChange(event: any) {
    const selectedPage = parseInt(event.target.value, 10);
    this.goToPage(selectedPage);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.router.navigate(['/products'], { queryParams: { page: this.currentPage} });
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
    var search = document.getElementById('searchProducts') as HTMLInputElement;
    search.value = '';
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

  changeToNextImage(toy: Toy): void {
    if(toy.image.length > 1){
      this.originalImage = toy.image[0];
      toy.image[0] = toy.image[1];
    }
  }

  changeResetImage(toy: Toy): void {
    if (this.originalImage !== '') {
      toy.image[0] = this.originalImage;
      this.originalImage = '';
    }
  }

  cards = [
    { title: 'Muñecas', image: 'https://i.imgur.com/2WwiNq6.jpeg' },
    { title: 'Autos', image: 'https://i.imgur.com/0cjmqR2.jpeg' },
    { title: 'Peluches', image: 'https://i.imgur.com/0EZpqAW.jpeg' },
    { title: 'Musicales', image: 'https://imgur.com/mc8lYBl.jpeg' },
    { title: 'Aire Libre', image: 'https://imgur.com/r05JiYo.jpeg' },
    { title: 'Bloques, Construcción', image: 'https://imgur.com/ubhfvJE.jpeg' },
    { title: 'Juego De Mesa', image: 'https://imgur.com/QhVDtuO.jpeg' },
    { title: 'Ingenio', image: 'https://imgur.com/BaD5P3h.jpeg' },
    { title: 'Dinosaurios', image: 'https://imgur.com/RzA4iBz.jpeg' },
    { title: 'Didáctico', image: 'https://imgur.com/DsWbEWI.jpeg' },
  ];
  currentIndex = 0;
  transform = 'translateX(0)';
  currentTranslate = 0;
  prevTranslate = 0;
  startX = 0;
  isDragging = false;
  visibleCards = 4;

  calculateVisibleCards() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      this.visibleCards = 1;
    } else if (screenWidth < 768) {
      this.visibleCards = 2;
    } else if (screenWidth < 992) {
      this.visibleCards = 3;
    } else {
      this.visibleCards = 4;
    }
    this.updateTransform();
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.updateTransform();
  }

  nextSlide() {
    if (this.currentIndex < this.cards.length - this.visibleCards) {
      this.currentIndex++;
    }
    this.updateTransform();
  }

  updateTransform() {
    const cardWidth = 15; // 15rem
    const gap = 1; // 0.5rem en cada lado
    const totalCardWidth = cardWidth + 2 * gap; // ancho total por tarjeta incluyendo margen
    this.transform = `translateX(-${this.currentIndex * totalCardWidth}rem)`;
    this.currentTranslate = -this.currentIndex * totalCardWidth;
    this.prevTranslate = this.currentTranslate;
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
    this.prevTranslate = this.currentTranslate;
  }

  onTouchMove(event: TouchEvent) {
    if (this.isDragging) {
      const currentX = event.touches[0].clientX;
      const diff = currentX - this.startX;
      this.currentTranslate = this.prevTranslate + diff / 16; // Dividir por 16 para convertir píxeles a rem
      this.transform = `translateX(${this.currentTranslate}rem)`;
    }
  }

  onTouchEnd() {
    this.isDragging = false;
    const cardWidth = 15; // 15rem
    const gap = 1; // 0.5rem en cada lado
    const totalCardWidth = cardWidth + 2 * gap; // ancho total por tarjeta incluyendo margen

    // Ajustar la posición al índice más cercano
    const movedCards = Math.round(-this.currentTranslate / totalCardWidth);
    this.currentIndex = Math.min(Math.max(movedCards, 0), this.cards.length - this.visibleCards);
    this.updateTransform();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateVisibleCards();
  }

  
}
