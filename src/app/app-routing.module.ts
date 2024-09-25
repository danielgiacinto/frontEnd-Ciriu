import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { LogsComponent } from './components/login/logs.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';
import {checkoutUserGuard} from "./guards/checkoutUser.guard";
import {checkoutCartGuard } from './guards/checkoutCart.guard';
import { UserComponent } from './components/user/user.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyComponent } from './components/signup/verify/createAccount.component';
import { CardProductComponent } from './components/products/cardProduct/cardProduct.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { checkoutPaymentGuard } from './guards/checkoutPayment.guard';
import { OrdersComponent } from './components/user/orders/orders.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductsAdminComponent } from './components/admin/productsAdmin/productsAdmin.component';
import { ReportAdminComponent } from './components/admin/reportAdmin/reportAdmin.component';
import { StockAdminComponent } from './components/admin/stockAdmin/stockAdmin.component';
import { SupportComponent } from './components/admin/support/support.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { SuccessComponent } from './components/success/success.component';
import { PendingComponent } from './components/pending/pending.component';
import { PasswordComponent } from './components/password/password.component';
import { ChangePasswordComponent } from './components/password/changePassword/changePassword.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'cart', component: CartComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'products/:code', component: CardProductComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LogsComponent},
  {path: 'recoverPassword', component: PasswordComponent},
  {path: 'recoverPassword/reset/:token', component: ChangePasswordComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [checkoutUserGuard, checkoutCartGuard]},
  {path: 'checkout/payment', component: PaymentComponent, canActivate: [checkoutUserGuard, checkoutCartGuard, checkoutPaymentGuard]},
  {path: 'login/verify/:code', component: VerifyComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'terms', component: ConditionsComponent},
  {path: 'faq', component: QuestionsComponent},
  {path: 'success', component: SuccessComponent},
  {path: 'pending', component: PendingComponent},
  {path: 'admin/orders', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [adminGuard]},
  {path: 'admin/products', component: ProductsAdminComponent, canActivate: [adminGuard]},
  {path: 'admin/report', component: ReportAdminComponent, canActivate: [adminGuard]},
  {path: 'admin/stock', component: StockAdminComponent, canActivate: [adminGuard]},
  {path: 'admin/support', component: SupportComponent, canActivate: [adminGuard]},
  {path: 'user/info', component: UserComponent, canActivate: [userGuard]},
  {path: 'user/orders', component: OrdersComponent, canActivate: [userGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
