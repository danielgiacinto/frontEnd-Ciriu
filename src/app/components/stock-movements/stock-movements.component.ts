import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-movements',
  templateUrl: './stock-movements.component.html',
  styleUrls: ['./stock-movements.component.css']
})
export class StockMovementsComponent implements OnChanges{

  constructor(private stockService: StockService) { }


  @Input() productCode: string = '';
  @Output() movementRegistered = new EventEmitter<void>();
  message: string = '';

  formMovements = new FormGroup({
    date: new FormControl(this.getCurrentDateTime(), [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    movement: new FormControl('', [Validators.required]),
    code_product: new FormControl('', [Validators.required]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productCode'] && changes['productCode'].currentValue) {
      this.formMovements.get('code_product')?.setValue(this.productCode);
    }

    this.formMovements.get('date')?.setValue(this.getCurrentDateTime());
  }

  registerMovement(){
    if(this.formMovements.valid){
      console.log(this.formMovements.value);
      this.stockService.createMovement(this.formMovements.value).subscribe(data => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Se registro el movimiento con éxito"
        });

        this.movementRegistered.emit();
      }, error => {
        this.message = error.error.message;
        console.log(error);
      })
    }
  }

  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

}
