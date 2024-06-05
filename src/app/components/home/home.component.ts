import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }

  cards = [
    { title: 'Muñecas', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt5f6006a4b6ed6875/61ba0219cbf1910f34154450/Mattel_Shopper_HP_2-1_Category_Dolls_Copy.jpg' },
    { title: 'Autos', image: 'https://i.ibb.co/spfxH8S/cars-cars-and-vehicles.jpg' },
    { title: 'Peluches', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blta6ca5eea2aefc4c4/61ba02191fb57b569e60b7f4/Mattel_Shopper_HP_2-9_Category_Plush_Copy.jpg' },
    { title: 'Musicales', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt8c0958f632e107aa/61ba08bc702c7d57ccdd0a8c/Mattel_Shopper_HP_2-2_Category_Cars.jpg' },
    { title: 'Aire Libre', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt5f6006a4b6ed6875/61ba0219cbf1910f34154450/Mattel_Shopper_HP_2-1_Category_Dolls_Copy.jpg' },
    { title: 'Bloques, Construcción', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt27bb96d8cc7a9ca0/61ba0219c7bcdd56a3191d81/Mattel_Shopper_HP_2-7_Category_Building-Blocks_Copy.jpg' },
    { title: 'Juego De Mesa', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt820f433071d4ecdb/61ba0219f0a5f27e0047fa73/Mattel_Shopper_HP_2-8_Category_Games_Copy.jpg' },
    { title: 'Ingenio', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt8c0958f632e107aa/61ba08bc702c7d57ccdd0a8c/Mattel_Shopper_HP_2-2_Category_Cars.jpg' },
    { title: 'Dinosaurios', image: 'https://i.ibb.co/rQnnxWr/AF-LP-1-1-Dinosaurs-682x821.jpg' },
    { title: 'Didáctico', image: 'https://images.mattel.net/image/upload/w_360,c_scale/shop-contentstack/blt8c0958f632e107aa/61ba08bc702c7d57ccdd0a8c/Mattel_Shopper_HP_2-2_Category_Cars.jpg' },
  ];
  currentIndex = 0;
  transform = 'translateX(0)';
  dragging = false;
  startX = 0;
  currentTranslate = 0;
  prevTranslate = 0;

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.updateTransform();
  }

  nextSlide() {
    const visibleCards = 4; // Number of visible cards
    if (this.currentIndex < this.cards.length - visibleCards) {
      this.currentIndex++;
    }
    this.updateTransform();
  }

  updateTransform() {
    const cardWidth = 15; // 15rem
    const gap = 1; // 0.5rem on each side
    const totalCardWidth = cardWidth + 2 * gap; // total width per card including margin
    this.transform = `translateX(-${this.currentIndex * totalCardWidth}rem)`;
    this.currentTranslate = -this.currentIndex * totalCardWidth;
    this.prevTranslate = this.currentTranslate;
  }

  onDragStart(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.startX = event instanceof MouseEvent ? event.pageX : event.touches[0].clientX;
    this.prevTranslate = this.currentTranslate;
  }
  
  onDrag(event: MouseEvent | TouchEvent) {
    if (this.dragging) {
      const currentX = event instanceof MouseEvent ? event.pageX : event.touches[0].clientX;
      const diff = currentX - this.startX;
      const cardWidth = 15; // 15rem
      const gap = 1; // 0.5rem on each side
      const totalCardWidth = cardWidth + 2 * gap; // total width per card including margin
      const maxTranslate = -(this.cards.length) * totalCardWidth; // Limit to the last card set
      const minTranslate = 0; // Limit to the first card set
      this.currentTranslate = Math.min(minTranslate, Math.max(maxTranslate, this.prevTranslate + diff));
      this.transform = `translateX(${this.currentTranslate}px)`;
    }
  }
  
  onDragEnd() {
    if (this.dragging) {
      this.dragging = false;
      this.prevTranslate = this.currentTranslate;
    }
  }


}
