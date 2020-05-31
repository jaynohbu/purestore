import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductData } from '../model/product-data';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UtilityService, Code } from '../service/utility.service';
import { ProductService } from '../service/product.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input()
  product: ProductData;
  @Input("categories")
  categories: string[];
  @Input("productNames")
  proucts: string[];

  @Output("init") init: EventEmitter<any> = new EventEmitter();
  editMode: boolean = false;
  public productForm: FormGroup;

  filteredCategories: Observable<any[]>;
  filteredProducts: Observable<any[]>;

  hasError: boolean = false;
  errorMessage: string;
  author: string;
  public activity: Subject<any>;
  constructor(private fb: FormBuilder, private productService: ProductService, private authService: AuthService, private router: Router) {
  
    this.activity = new Subject<any>();
    this.init = new EventEmitter();

    let user = sessionStorage.getItem('user');
    if (!user) this.router.navigate(['login']);
    let userObj: any = JSON.parse(user);
    this.author = userObj.username;

  }
  public resetContent() {

    if (!this.product) {
      console.log(this.product)
    }
    this.productForm = this.fb.group(this.product as any);
    //console.log(this.content.content_key);
  }

  contentKeyExist() {
    if (this.productForm.controls.sku.value) {
      if (this.productForm.controls.sku.value.length > 0) {
        return true;
      }
    }
    return false;
  }
  ngOnInit() {
    this.activity.asObservable().subscribe(d => {

      this.init.emit({
        data: d
      })
    })
    this.resetContent();
    this.filteredCategories = this.productForm.controls.category_name.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCategories(value))
      );
    this.filteredProducts = this.productForm.controls.course_name.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProducts(value))
      );
  
  }
  private _filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterProducts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.proucts.filter(option => option.toLowerCase().includes(filterValue));
  }

 
  private _delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private async _getProductBySku(key) {
    if (key) {
      this.productForm.controls.content_key.setValue(key);
      await this._delay(100);
      let data = await this.productService.getProductBySku(key).toPromise() as any;

      if (!data.body.activity) {
        this._getProductBySku(key);
        return;
      }
      this.productForm.controls.title.setValue(data.body.activity.name);
      this.productForm.controls.description.setValue(data.body.activity.description);
      if (data.body.activity.description.indexOf('ERROR:') > 0) {
        this.productForm.controls.description.setValue('');
        this.hasError = true;
        this.errorMessage = data.body.error;
      } else {
       
        // let course_name = [parts[0], parts[1], parts[2], parts[3]].join('-');
        // this.productForm.controls.course_name.setValue(course_name);
        // this.productForm.controls.category_name.setValue(category_name);
        // this.productForm.controls.country.setValue(country);
        // this.productForm.controls.language.setValue(language);

      }
      this.productForm.controls.activity_id.setValue(data.body.activity.activity_id);
      this.productForm.controls.author.setValue(this.author);

      this.activity.next(data.body.activity);


    }
  }
  uploadComplete(key) {
    //UPLOAD-COMPLETE
    this._getProductBySku(key);
  }
  submit() {
    this.editMode = false;
  }

}
