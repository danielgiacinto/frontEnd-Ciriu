import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toy } from 'src/app/models/Toy';
import { Order } from 'src/app/models/order';
import { MercadoPagoService } from 'src/app/services/mercadoPago.service';
import { OrderService } from 'src/app/services/order.service';
declare var MercadoPago: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private mercadoPagoService: MercadoPagoService,
  ) {}
  cart: Toy[] = [];
  order: Order = new Order();
  paymentForm: FormGroup = new FormGroup({});
  hiddenButton: boolean = true;
  hiddenSpinner: boolean = false;
  mp = new MercadoPago('APP_USR-4daa2c91-0e00-48ab-83b0-6ab3f2f031ce', { locale: 'es-AR' });

  ngOnInit() {
    const cart = localStorage.getItem('cart') || '[]';
    this.cart = JSON.parse(cart);

    this.paymentForm = this.fb.group({
      shipping: ['', Validators.required],
      payment: ['', Validators.required],
    });
  }

  getTotal() {
    let total = 0;
    this.cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  pay() {
    if (this.cart.length > 0 && this.paymentForm.valid) {
      this.hiddenButton = false;
      this.hiddenSpinner = true;
      const idUser = localStorage.getItem('user') || ''.toString();
      const orderData = {
        idUser : idUser, 
        shippmentMode: this.paymentForm.value.shipping, 
        items: this.cart.map((item) => ({
          code: item.code,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
      })),
      }
      // hacer petion post al backEnd para crear la preferencia y que devuelva el id
      this.mercadoPagoService.payMercadoPago(orderData).subscribe(
        (data) => {
          console.log(data);
          const preference = data;
          this.createCheckoutButton(preference.id);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  async createCheckoutButton(preferenceId: any) {
    const bricksBuilder = this.mp.bricks();
    
    await bricksBuilder.create('wallet', 'wallet_container', {
      initialization: {
        preferenceId: preferenceId,
        redirectMode: 'self',
      },
      callbacks: {
        onReady: () => {
          this.hiddenSpinner = false;
        },
        onSubmit: () => {
          localStorage.removeItem('cart');
        },
        
      },
      customization: {
        texts: {
          valueProp: 'smart_option',
        },
        visual:{
          buttonBackground: 'default',
          borderRadius: '15px',
        }
      },
    });
  }
  
}
