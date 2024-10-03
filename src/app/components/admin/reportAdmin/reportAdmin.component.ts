import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToyService } from 'src/app/services/toy.service';
import { Toy } from 'src/app/models/Toy';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { utils as XLSXUtils, write, WorkSheet, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';
import * as ApexCharts from 'apexcharts';

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
  totalMethodPayment: [] = [];
  totalMonthYear: any = [];
  private suscripciones = new Subscription();
  formReport = new FormGroup({
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
  });
  formBar = new FormGroup({
    year: new FormControl(new Date().getFullYear(), [
      Validators.required,
      Validators.min(1900),
      Validators.max(2100),
    ]),
  });
  ngOnInit() {
    this.suscripciones.add(
      this.userService.getInfo().subscribe((data) => {
        this.user = data;
      })
    );
    this.getReport();
    this.getReportBar();
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
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
      }
    });
  }

  getReport() {
    const today = new Date();
    const fromDate = this.formReport.value.fromDate
      ? this.formReport.value.fromDate
      : this.formatDate(new Date(today.getFullYear(), 0, 1));
    const toDate = this.formReport.value.toDate
      ? this.formReport.value.toDate
      : this.formatDate(today, true);
    this.formReport.patchValue({
      fromDate: fromDate,
      toDate: toDate,
    });
    this.orderService.consultReport(fromDate, toDate).subscribe((data) => {
      console.log(data);
      this.totalSales = data.sales;
      this.totalOrders = data.totalOrders;
      this.quantity = data.productTop.quantity;
      this.porcentMethodPayment(data.methodpayment);
      this.totalMethodPayment = data.methodpayment;
      this.toyService.getToyByCode(data.productTop.code).subscribe((data) => {
        this.toy = data;
      });
    });
  }

  getReportBar() {
    const today = new Date();
    const year = this.formBar.value.year
      ? this.formBar.value.year
      : today.getFullYear();
    if (this.formBar.valid) {
      this.orderService.consultReportMonth(year).subscribe((data) => {
        this.totalMonthYear = data;
        this.viewBar(data);
        console.log(this.totalMonthYear);
      });
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
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    var chart = new ApexCharts(document.querySelector('#payment'), options);
    chart.render();
  }

  viewBar(data: any) {
    console.log(data);
    var seriesData = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        seriesData.push({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          data: data[key],
        });
      }
    }
    var options = {
      series: seriesData,
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
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
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return '$ ' + val + ' pesos';
          },
        },
      },
    };

    var chart = new ApexCharts(document.querySelector('#ventas'), options);
    chart.render();
  }

  exportToPDF(): void {
    const pdfName = 'reporte.pdf';

    const element = document.getElementById('content-to-export');

    if (element) {
      html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(imgData, 'PNG', 10, 10, 180, 200);
          pdf.save(pdfName);
        });
      } else {
        console.error(
          'El elemento con ID "content-to-export" no se encontró en el DOM.'
        );
      }
  }
  

  exportToExcel(): void {
    const categories = Object.keys(this.totalMonthYear);
    const salesData = [
      ['Categoría', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    ];

    categories.forEach(category => {
      const monthlySales = this.totalMonthYear[category];
      if (Array.isArray(monthlySales) && monthlySales.length === 12) {
        salesData.push([category, ...monthlySales]);
      } else {
        console.warn(`Datos incompletos o incorrectos para la categoría: ${category}`);
        salesData.push([category, ...Array(12).fill(0)]);
      }
    });
    const method = Object.keys(this.totalMethodPayment);
    const methodData = Object.values(this.totalMethodPayment);
    const methodPaymentData: { Descripción: string; Valor: number }[] = [];
    for (let i = 0; i < method.length; i++) {
      methodPaymentData.push({
        Descripción: method[i],
        Valor: methodData[i] as number,
      });
    }
    const generalData: { Descripción: string; Valor: number | string }[] = [
      { Descripción: 'Ordenes totales', Valor: this.totalOrders },
      { Descripción: 'Total vendido', Valor: this.totalSales },
      { Descripción: 'Producto más vendido', Valor: `${this.toy.name} ${this.quantity} unidades` },
      { Descripción: '', Valor: '' },
      { Descripción: 'Método de pago', Valor: 'Importe' },
      ...methodPaymentData,
    ];


    const worksheetGeneral: WorkSheet = XLSXUtils.json_to_sheet(generalData);
    const worksheetSales: WorkSheet = XLSXUtils.aoa_to_sheet(salesData);
   
    const workbook: WorkBook = {
      Sheets: { 
        'Datos Generales': worksheetGeneral,
        'Datos de Ventas': worksheetSales
      },
      SheetNames: ['Datos Generales', 'Datos de Ventas'],
    };

    const excelBuffer: any = write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, 'Reporte Ciriu ');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(data, `${fileName}${new Date().getFullYear()}.xlsx`);
  }
}
