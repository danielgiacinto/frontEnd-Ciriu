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
    { title: 'Muñecas', image: 'https://i.ibb.co/mD2jd1P/munecas.jpg' },
    { title: 'Autos', image: 'https://i.ibb.co/bbp6w6k/autos.jpg' },
    { title: 'Peluches', image: 'https://i.ibb.co/4fqMt9g/peluches.jpg' },
    { title: 'Musicales', image: 'https://i.ibb.co/Bw5y002/musicalez.jpg' },
    { title: 'Aire Libre', image: 'https://i.ibb.co/gmr8s2s/aire-libre.jpg' },
    { title: 'Bloques, Construcción', image: 'https://i.ibb.co/kH480k2/bloques.jpg' },
    { title: 'Juego De Mesa', image: 'https://i.ibb.co/rH9tff3/juego-de-mesa.jpg' },
    { title: 'Ingenio', image: 'https://i.ibb.co/3db37bF/ingenio.jpg' },
    { title: 'Dinosaurios', image: 'https://i.ibb.co/LkrVrf3/dinosaurios.jpg' },
    { title: 'Didáctico', image: 'https://i.ibb.co/p4hffpb/didactico.jpg' },
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

}
