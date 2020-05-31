import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, CanActivate } from '@angular/router';
import { LoginComponent } from "./login/login.component";

import { AuthGuardService } from './service/auth-guard.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProductAdminComponent } from './product-admin/product-admin.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { title: 'Portal Login' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Portal Login' }
  },
  {
    path: 'checkout/:key',
    component: CheckoutComponent,
    data: { title: 'checkout' }
  }
,
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Portal Login' }
  },//ProductAdminComponent
  {
    path: 'products',
    component: ProductAdminComponent,
    data: { title: 'Product Administration' }
  },//ProductAdminComponent
  {
    path: 'passwordreset/:hascode',
    component: ResetPasswordComponent,
    data: { title: 'Reset Password' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




