import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Toy } from 'src/app/models/Toy';
import { Country } from 'src/app/models/country';
import { Province } from 'src/app/models/province';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { CountryService } from 'src/app/services/country.service';
import { ProvinceService } from 'src/app/services/province.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private userService: UserService, 
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private fb: FormBuilder,
    private router: Router) { }

  cart: Toy[] = [];
  countries: Country[] = [];
  provinces: Province[] = [];
  user: User = new User();
  checkoutForm: FormGroup = new FormGroup({});
  private suscripciones = new Subscription();
  ngOnInit() {
    const cart = localStorage.getItem('cart') || '[]';
    this.cart = JSON.parse(cart);

    this.checkoutForm = this.fb.group({
      name: [{value: this.user.name}, Validators.required],
      lastname: [{value: this.user.lastname}, Validators.required],
      phone: [{value: this.user.phone}, Validators.required],
      country: [{value: this.user.country}, Validators.required],
      province: [{value: this.user.province}, Validators.required],
      city: [{value: this.user.city}, Validators.required],
      address: [{value: this.user.address}, Validators.required],
      floor: [{value: this.user.floor} ],
      departament: [{value: this.user.departament}],
    });
    this.suscripciones.add(
      this.userService.getInfo().subscribe(data => {
        this.user = data;
        this.checkoutForm.patchValue({
          name: this.user.name,
          lastname: this.user.lastname,
          phone: this.user.phone,
          country: this.user.country,
          province: this.user.province,
          city: this.user.city,
          address: this.user.address,
          floor: this.user.floor,
          departament: this.user.departament
        });
      })
    )
    this.suscripciones.add(
      this.countryService.getCountries().subscribe(data => {
        this.countries = data;
      })
    )
    this.suscripciones.add(
      this.provinceService.getProvinces().subscribe(data => {
        this.provinces = data;
      })
    )
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }

  getTotal() {
    let total = 0;
    this.cart.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  }

  checkoutPay() {
    if(this.checkoutForm.valid && this.cart.length > 0) {
      console.log(this.checkoutForm.value);
      const user = this.checkoutForm.value;
      this.userService.updateInfo(user).subscribe(
        data => {
          console.log(data);
          this.router.navigate(['checkout/payment']);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
