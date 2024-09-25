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
import { UserComponent } from './components/user/user.component';
import { SignupComponent } from './components/signup/signup.component';
import { VerifyComponent } from './components/signup/verify/createAccount.component';
import { CardProductComponent } from './components/products/cardProduct/cardProduct.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentComponent } from './components/checkout/payment/payment.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { ProductsAdminComponent } from './components/admin/productsAdmin/productsAdmin.component';
import { ReportAdminComponent } from './components/admin/reportAdmin/reportAdmin.component';
import { StockAdminComponent } from './components/admin/stockAdmin/stockAdmin.component';
import { FooterComponent } from './components/footer/footer.component';
import { SupportComponent } from './components/admin/support/support.component';
import { NewBrandComponent } from './components/admin/support/newBrand/newBrand.component';
import { NewCategoryComponent } from './components/admin/support/newCategory/newCategory.component';
import { NewSubcategoryComponent } from './components/admin/support/newSubcategory/newSubcategory.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SuccessComponent } from './components/success/success.component';
import { PendingComponent } from './components/pending/pending.component';
import { PasswordComponent } from './components/password/password.component';
import { ChangePasswordComponent } from './components/password/changePassword/changePassword.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    CartComponent,
    ContactComponent,
    HomeComponent,
    LogsComponent,
    ProductsComponent,
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
    SupportComponent,
    NewBrandComponent,
    NewCategoryComponent,
    NewSubcategoryComponent,
    ConditionsComponent,
    QuestionsComponent,
    SuccessComponent,
    PendingComponent,
    PasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeEs);
