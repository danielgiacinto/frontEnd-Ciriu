import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { LogsComponent } from './components/login/logs.component';
import { ProductsComponent } from './components/products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { UserComponent } from './components/user/user.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyComponent } from './components/verify/createAccount.component';
import { CardProductComponent } from './components/products/cardProduct/cardProduct.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { ProductsAdminComponent } from './components/admin/productsAdmin/productsAdmin.component';
import { ReportAdminComponent } from './components/admin/reportAdmin/reportAdmin.component';
import { StockAdminComponent } from './components/admin/stockAdmin/stockAdmin.component';
import { FooterComponent } from './components/footer/footer.component';
import { SupportComponent } from './components/admin/support/support.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CartComponent,
    ContactComponent,
    HomeComponent,
    LogsComponent,
    ProductsComponent,
    AdminComponent,
    UserComponent,
    SignupComponent,
    VerifyComponent,
    CardProductComponent,
    CheckoutComponent,
    PaymentComponent,
    OrdersComponent,
    ProductsAdminComponent,
    ReportAdminComponent,
    StockAdminComponent,
    FooterComponent,
    SupportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
