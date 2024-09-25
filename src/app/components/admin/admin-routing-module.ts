import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: '', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Debe ser 'forChild' en lugar de 'forRoot'
  exports: [RouterModule]
})
export class AdminRoutingModule { }
