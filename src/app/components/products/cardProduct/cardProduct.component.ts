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
  toy: Toy = new Toy();
  private suscripciones = new Subscription();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') || '';
    })
    this.suscripciones.add(
      this.toyService.getToyByCode(this.code).subscribe(
        (data) => {
          this.toy = data;
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

  changeImage(image: string) {
    const img = document.getElementById('imageHome') as HTMLImageElement;
    img.src = image;
  }


  
  

}
