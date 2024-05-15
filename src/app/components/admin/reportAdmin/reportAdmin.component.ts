import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  methodPayment: any | null;
  toy: Toy = new Toy();
  quantity: number = 0;
  private suscripciones = new Subscription();
  formReport = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });
  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    );
    this.getReport();
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
      this.methodPayment = data.methodpayment;
      this.quantity = data.productTop.quantity;
      this.porcentMethodPayment();
      this.viewBar();
      this.toyService.getToyByCode(data.productTop.code).subscribe((data) => {
        this.toy = data;
      })
    });
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

  viewBar() {
    var options = {
      series: [
        {
          name: 'Ventas',
          data: [
            150000, 150000, 120000, 100000, 35000, 100000, 50000, 100000,
            100000, 25000, 100000, 100000
          ],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['82E0AA'],
        },
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        position: 'start',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#85C1E9',
              colorTo: '#85C1E9',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
    };

    var chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }

  porcentMethodPayment() {
    const values = Object.values(this.methodPayment);
    const labels = Object.keys(this.methodPayment);
    var options = {
      series: values,
      chart: {
      width: 400,
      type: 'pie',
    },
    labels: labels,
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
}
