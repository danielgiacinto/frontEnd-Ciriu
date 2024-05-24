import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import * as ApexCharts from 'apexcharts';
import { OrderService } from 'src/app/services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToyService } from 'src/app/services/toy.service';
import { Toy } from 'src/app/models/Toy';

@Component({
  selector: 'app-reportAdmin',
  templateUrl: './reportAdmin.component.html',
  styleUrls: ['./reportAdmin.component.css'],
})
export class ReportAdminComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private orderService: OrderService,
    private toyService: ToyService
  ) {}
  user: User = new User();
  totalOrders: number = 0;
  totalSales: number = 0;
  toy: Toy = new Toy();
  quantity: number = 0;
  private suscripciones = new Subscription();
  formReport = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });
  formBar = new FormGroup({
    year: new FormControl(new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2100)]),
  })
  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    );
    this.getReport();
    this.getReportBar();
  }

  logout() {
    Swal.fire({
      title: '¡Advertencia!',
      text: '¿Estás seguro de que deseas cerrar sesion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar sesion',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['/home']);
      }
    });
  }

  getReport() {
    const today = new Date();
    const fromDate = this.formReport.value.fromDate
      ? this.formReport.value.fromDate
      : this.formatDate(
          new Date(today.getFullYear(), 0, 1)
        );
    const toDate = this.formReport.value.toDate
      ? this.formReport.value.toDate
      : this.formatDate(today, true);
      this.formReport.patchValue({
        fromDate: fromDate,
        toDate: toDate
      })
    this.orderService.consultReport(fromDate, toDate).subscribe((data) => {
      console.log(data);
      this.totalSales = data.sales;
      this.totalOrders = data.totalOrders;
      this.quantity = data.productTop.quantity;
      this.porcentMethodPayment(data.methodpayment);
      this.toyService.getToyByCode(data.productTop.code).subscribe((data) => {
        this.toy = data;
      })
    });
  }

  getReportBar() {
    const today = new Date();
    const year = this.formBar.value.year ? this.formBar.value.year : today.getFullYear();
    if(this.formBar.valid) {
      this.orderService.consultReportMonth(year).subscribe((data) => {
        this.viewBar(data);
      })
    }
  }
  formatDate(date: Date, endOfDay: boolean = false): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hours = '00';
    let minutes = '00';

    if (endOfDay) {
      hours = '23';
      minutes = '59';
    }

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  porcentMethodPayment(data: any) {
    const values = Object.values(data);
    const labels = Object.keys(data);
    var options = {
      series: values,
      chart: {
      width: 400,
      type: 'pie',
    },
    labels: labels,
    tooltip: {
      y: {
        formatter: function (val: any) {
          return `$${val}`;
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
    };

    var chart = new ApexCharts(document.querySelector("#payment"), options);
    chart.render();
  }

  viewBar(data: any) {
    console.log(data);
    var seriesData = [];

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            seriesData.push({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                data: data[key]
            });
        }
    }
    var options = {
      series: seriesData,
      chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    },
    // yaxis: {
    //   title: {
    //     text: '$ (pesos)'
    //   }
    // },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val : any) {
          return "$ " + val + " pesos"
        }
      }
    }
    };

    var chart = new ApexCharts(document.querySelector("#ventas"), options);
    chart.render();
  }

  
}
