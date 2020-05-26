import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CheckoutComponent } from "./checkout/checkout.component";
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { title: 'Portal Login' },
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Portal Password' }
  },
  {
    path: 'checkout/:key',
    component: CheckoutComponent,
    data: { title: 'checkout' }
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
