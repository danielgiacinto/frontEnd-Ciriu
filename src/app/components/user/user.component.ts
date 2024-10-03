import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Country } from 'src/app/models/country';
import { Province } from 'src/app/models/province';
import { User } from 'src/app/models/user';
import { CountryService } from 'src/app/services/country.service';
import { ProvinceService } from 'src/app/services/province.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, 
    private router: Router,
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private fb: FormBuilder) { }
  
  private suscripciones = new Subscription();
  user: User = new User();
  countries: Country[] = [];
  provinces: Province[] = [];
  mostrarBoton:boolean = false;
  userForm: FormGroup = new FormGroup({});

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [{value: this.user.name, disabled: !this.mostrarBoton}, Validators.required],
      lastname: [{value: this.user.lastname, disabled: !this.mostrarBoton}, Validators.required],
      phone: [{value: this.user.phone, disabled: !this.mostrarBoton}, [Validators.required, Validators.max(9999999999)]],
      country: [{value: this.user.country, disabled: !this.mostrarBoton}, Validators.required],
      province: [{value: this.user.province, disabled: !this.mostrarBoton}, Validators.required],
      city: [{value: this.user.city, disabled: !this.mostrarBoton}, Validators.required],
      address: [{value: this.user.address, disabled: !this.mostrarBoton}, Validators.required],
      floor: [{value: this.user.floor, disabled: !this.mostrarBoton} ],
      departament: [{value: this.user.departament, disabled: !this.mostrarBoton}],
    });
    this.suscripciones.add(
      this.userService.getInfo().subscribe(data => {
        this.user = data;
        console.log(this.user);
        this.userForm.patchValue({
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

  updateInfo() {
    console.log(this.userForm.value);
    if(this.userForm.valid){
      const user = this.userForm.value;
      this.userService.updateInfo(user).subscribe(
        data => {
          console.log(data);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Se actualizó con exito la información"
          });
          this.mostrarBoton = false;
          this.userForm.disable();
          this.userService.getInfo().subscribe(data => {
            console.log(data);
            this.user = data;
          })
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  logout() {
    Swal.fire({
      title: 'Atencion',
      text: '¿Estás seguro de que deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesion',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  edit() {
    this.mostrarBoton = true;
    this.userForm.enable();
    this.userForm.updateValueAndValidity();
  }
  
  cancel() {
    this.mostrarBoton = false;
    this.userForm.disable();
    this.userService.getInfo().subscribe(data => {
      console.log(data);
      this.user = data;
      this.userForm.patchValue({
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
  }

}
