

import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductData } from '../model/product-data';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../service/product.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmComponent } from '../dialogs/delete-confirm/delete-confirm.component';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Category } from '../model/category';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {

  displayedColumns: string[] = ['category_name', 'sku', 'title', 'description','updated_at','_id'];
  dataSourceProduct: MatTableDataSource<ProductData>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(ProductDetailComponent) current_detail: ProductDetailComponent;
  product_name: string;
  editMode: boolean = false;
  showEdit: boolean = false;
  isProd: boolean = false;
  products: any[] = [];
  categories: Category[] = [];
  outProduct: ProductData;
  hasError: boolean = false;
  errorMessage: string;
  sku: number;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private productService: ProductService, private authService: AuthService, public dialog: MatDialog, private router: Router) {
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-delete_forever-24px.svg'));
    iconRegistry.addSvgIcon('play', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-play_circle_outline-24px.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-add_circle_outline-24px.svg'));
    iconRegistry.addSvgIcon('save', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-save_alt-24px.svg'));
    iconRegistry.addSvgIcon('cancel', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-cancel-24px.svg'));
    iconRegistry.addSvgIcon('logout', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-exit_to_app-24px.svg'));
    iconRegistry.addSvgIcon('link', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-link-24px.svg'));
    iconRegistry.addSvgIcon('copy', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/file_copy-24px.svg'));
    this.dataSourceProduct = new MatTableDataSource(this.products);
    if (!environment.production) {
      this.showEdit = true;
    }
    else {
      this.isProd = true;
      let user = sessionStorage.getItem('user');
      if (!user) this.router.navigate(['login']);
      let userObj: any = JSON.parse(user);
      userObj.attributes["custom:isTemp"] == 'Y' ? this.showEdit = true : this.showEdit = false;
    }
  }
  logOut() {
    this.authService.logOut();
  }
  productChange(e){
    this.outProduct=e.product;
  }
  saveProduct() {
    this.hasError = false;
    this.errorMessage = "";
    if (this.outProduct.imageUrls.length<2){
      this.hasError=true;
      this.errorMessage="At least two images are required.";
      return;
    }
    if (this.current_detail.productForm.valid) {
      try {
        this.productService.updateProduct(this.outProduct).subscribe(e => {
          if (e instanceof HttpResponse) {

          } else if (e instanceof HttpErrorResponse) {
            console.log(e);

          } else {
            console.log(e);

          }
        })
      } catch (ex) {

      }
    }else{
      this.hasError=true;
      this.errorMessage="Please fill out the form correctly."
    }
    this.editMode = false;
    this.reloadAllData();

  }
  refreshToken() {
    Auth.currentSession()
      .then(data => {

      })
      .catch(err => console.log(err));
    setTimeout(() => this.refreshToken(), 20000);
  }
  async reloadAllData() {
    this.productService.getAllProductCategores().subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.categories = event.body.categories;
        this.productService.getAllProducts().subscribe((event2) => {
          if (event2 instanceof HttpResponse) {
            this.products = event2.body.products;
            this.dataSourceProduct = new MatTableDataSource(this.products);
            this.dataSourceProduct.paginator = this.paginator;
            this.dataSourceProduct.sort = this.sort;
            this.paginator.pageIndex = 0;
          } else if (event2 instanceof HttpErrorResponse) {

          }
        });
      } else if (event instanceof HttpErrorResponse) {
        console.log(event);
      }
    });
  }

  ngOnInit() {
    this.reloadAllData();
    this.hasError = false;
    this.errorMessage = "";

  }
  edit(sku) {
    this.sku=sku;
    this.editMode = true;
  }
  addNew() {
    this.editMode = true;
  
  } 
  openConfirmDelete(sku: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') this.delete(sku);

    });
  }

  delete(sku) {
    this.productService.deleteProduct(sku).toPromise().then(
      () => {

        this.reloadAllData();
      },
      (err) => {
        console.log(err)
      }

    )
  }

  applyFilter(filterValue: string) {
    this.dataSourceProduct.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceProduct.paginator) {
      this.dataSourceProduct.paginator.firstPage();
    }
  }

}

