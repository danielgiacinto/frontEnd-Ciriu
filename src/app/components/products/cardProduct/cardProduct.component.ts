import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { CartService } from 'src/app/services/cart.service';
import { ToyService } from 'src/app/services/toy.service';

@Component({
  selector: 'app-cardProduct',
  templateUrl: './cardProduct.component.html',
  styleUrls: ['./cardProduct.component.css']
})
export class CardProductComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toyService: ToyService, private cartService: CartService) { }
  code: string = '';
  idImagenModal: number = 0;
  toy: Toy = new Toy();
  showBrand: boolean = true;
  private suscripciones = new Subscription();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') || '';
    })
    this.suscripciones.add(
      this.toyService.getToyByCode(this.code).subscribe(
        (data) => {
          this.toy = data;
          if(this.toy.brand == null || this.toy.brand == ''){
            this.showBrand = false;
          }
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

  addToCart(toy: any) {
    this.cartService.addToCart(toy);
  }

  setImage(i: number) {
    console.log(i);
    this.idImagenModal = i;
  }

  prevImage(i : number) {
    if(i > 0){
      this.idImagenModal = i - 1;
    }
  }

  nextImage(i : number) {
    if(i < this.toy.image.length - 1){
      this.idImagenModal = i + 1;
    }
  }

}
