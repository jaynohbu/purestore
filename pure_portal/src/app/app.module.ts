import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialsModule } from './ng-materials/ng-materials.module';
import { DatePipe } from '@angular/common';

import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductAdminComponent } from './product-admin/product-admin.component';
import { DeleteConfirmComponent } from './dialogs/delete-confirm/delete-confirm.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { UploadComponent } from './controls/upload/upload.component';
import { DialogComponent } from './controls/upload/dialog/dialog.component';
import { UploadService } from './controls/upload/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
   
    ResetPasswordComponent,
  
    CheckoutComponent,
  
    DashboardComponent,
  
    ProductAdminComponent,
  
    DeleteConfirmComponent,
  
    ProductDetailComponent,
  
    UploadComponent,
  
    DialogComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAngularModule,
    FormsModule,
  
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgMaterialsModule,
    MatNativeDateModule
  ],
  entryComponents: [DeleteConfirmComponent, DialogComponent],
  providers: [AmplifyService, DatePipe, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
