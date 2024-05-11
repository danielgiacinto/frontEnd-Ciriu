import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-newBrand',
  templateUrl: './newBrand.component.html',
  styleUrls: ['./newBrand.component.css']
})
export class NewBrandComponent implements OnInit {

  constructor(private brandService: BrandService) { }
  formNewBrand = new FormGroup({
    brand: new FormControl('', [Validators.required, Validators.minLength(3)]),
  })
  ngOnInit() {
  }

  createBrand(){
    if(this.formNewBrand.valid){
      console.log(this.formNewBrand.value);
      this.brandService.createBrand(this.formNewBrand.value).subscribe(
        data => {
          console.log(data);
          alert("Marca añadida");
          this.formNewBrand.reset();
        }
      )
    }
  }

}
