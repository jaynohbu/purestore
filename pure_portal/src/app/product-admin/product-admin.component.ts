

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

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.scss']
})
export class ProductAdminComponent implements OnInit {
 
  displayedColumns: string[] = ['category_name', 'sku', 'title', 'description'];
  dataSourceProduct: MatTableDataSource<ProductData>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(ProductDetailComponent) current_detail: ProductDetailComponent;
  product_name: string;
  editMode: boolean = false;
  showEdit: boolean = false;
  isProd: boolean = false;
  products: any[] = [];
  categories: any[] = [];
  categoryNames: string[];
  productNames: string[];
  currentProduct: ProductData;
  product_id: string;

  sku: string;
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
  saveCategory(current_detail, categories, productService) {
    return new Promise(function (resolve, reject) {
      if (current_detail.productForm.value.category_name) {
        let exist = categories.filter(c => c.name == current_detail.productForm.value.category_name);
        if (exist.length == 0) {
          productService.createCourseCategory({ name: current_detail.productForm.value.category_name }).subscribe(e => {
            if (e instanceof HttpResponse) {
              current_detail.productForm.value.category_id = e.body.category_id;
              return resolve();
            } else if (e instanceof HttpErrorResponse) {
              console.log(e);
              return reject();
            } else {
              console.log(e);

            }
          });
        } else {
          current_detail.productForm.value.category_id = exist[0].category_id;
          return resolve();
        }
      } else {
        return reject()
      }
    });
  }
  saveProduct(current_detail, courses, productService) {

    return new Promise(function (resolve, reject) {

      if (current_detail.productForm.value.sku) {
        let exist = courses.filter(c => c.name == current_detail.productForm.value.sku);
        if (exist.length == 0) {
          try {
            productService.createProduct({ name: current_detail.productForm.value.sku, category_id: current_detail.productForm.value.category_id }).subscribe(e => {
              if (e instanceof HttpResponse) {
                current_detail.productForm.value.course_id = e.body.course_id;
                return resolve();
              } else if (e instanceof HttpErrorResponse) {
                console.log(e);
                return reject();
              } else {
                console.log(e);

              }
            })
          } catch (ex) {
            console.log(ex);
            return reject();
          }
        } else {
          current_detail.productForm.value.course_id = exist[0].course_id;
          return resolve();
        }
      }
    })
  }
  async saveContent() {

    if (!this.current_detail.productForm.valid || this.current_detail.hasError) return;
    try {
      // if (!this.current_detail.productForm.value.activity_id) this.current_detail.productForm.value.activity_id = this.activity_id;
      // if (!this.current_detail.productForm.value.product_name) this.current_detail.productForm.value.course_name = this.course_name;
      // if (!this.current_detail.productForm.value.content_key) this.current_detail.productForm.value.course_name = this.content_key;
      // await this.saveCategory(this.current_detail, this.categories, this.productService);
      // await this.saveProduct(this.current_detail, this.courses, this.productService);

    } catch (ex) {
      console.log(ex);

    }

    // if (this.current_detail.productForm.value.content_id > 0) {
    //   this.productService.updateCourseContent(this.current_detail.productForm.value).toPromise().then(e => {
    //     this.reloadAllData();
    //     this.editMode = false;
    //   }, r => console.log(r))
    // } else {

    //   this.productService.createCourseContent(this.current_detail.productForm.value).toPromise().then(e => {
    //     this.reloadAllData();
    //     this.editMode = false;
    //   }, r => console.log(r))
    // }

  }
  reloadContets() {

    this.productService.getAllProducts().subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.products = event.body.data;
        // for (let content of this.contents) {
        //   if (this.productService.getCountryCodeByValue(content.country))
        //     content.country = this.productService.getCountryCodeByValue(content.country).text;
        //   if (this.productService.getLanguageCodeByValue(content.language))
        //     content.language = this.productService.getLanguageCodeByValue(content.language).text;
        // }
        this.dataSourceProduct = new MatTableDataSource(this.products);
        this.dataSourceProduct.paginator = this.paginator;
        this.dataSourceProduct.sort = this.sort;
        this.paginator.pageIndex = 0;
      } else if (event instanceof HttpErrorResponse) {
        console.log(event);
      }
    });


  }
  refreshToken() {
    Auth.currentSession()
      .then(data => {

      })
      .catch(err => console.log(err));
    setTimeout(() => this.refreshToken(), 20000);
  }
  async reloadAllData() {


    this.productService.getAllProducts().subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.products = event.body.data;
        this.productNames = [];
        for (let course of this.products) {
          this.productNames.push(course.name);
        }
      } else if (event instanceof HttpErrorResponse) {
        console.log(event);
      }
    });
    this.productService.getAllProductCategores().subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.categories = event.body.data;
        this.categoryNames = [];
        for (let cat of this.categories) {
          this.categoryNames.push(cat.name);
        }
      } else if (event instanceof HttpErrorResponse) {
        console.log(event);
      }
    });
    this.reloadContets();


  }
  onContentInit(e: any) {
    this.product_id = e.data.product_id;
    this.product_name = e.data.name;
    this.sku = e.data.sku;
  }
  ngOnInit() {
    this.reloadAllData();
   // this.currentProduct = new ProductData('', '', 0, '', '', '', '', '', 0, '', '', 0, 0, '', '', '');
  }
  edit(product_id) {
    this.editMode = true;
    this.currentProduct = this.products.find(c => c.product_id == product_id) as ProductData;
   

  }
  addNew() {
    this.editMode = true;
    //this.currentProduct
  }
  openConfirmDelete(content_id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') this.delete(content_id);

    });
  }





  delete(product_id) {
    this.productService.deleteProduct(product_id).toPromise().then(
      () => {

        this.reloadAllData();
      },
      (err) => {
        console.log(err)
      }

    )
  }


  // preview(content_id) {
  //   this.productService.getCourseContentURL(content_id).toPromise().then(
  //     (event) => {
  //       if (event instanceof HttpResponse) {
  //         let url = event.body.url;
  //         window.open(url, "_blank");

  //         console.log(url);

  //       } else if (event instanceof HttpErrorResponse) {
  //         console.log(event);
  //       }
  //     }
  //   )
  // }
  applyFilter(filterValue: string) {
    this.dataSourceProduct.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceProduct.paginator) {
      this.dataSourceProduct.paginator.firstPage();
    }
  }

}

