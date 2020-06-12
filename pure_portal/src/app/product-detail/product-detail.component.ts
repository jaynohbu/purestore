import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductData } from '../model/product-data';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UtilityService, Code } from '../service/utility.service';
import { ProductService } from '../service/product.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Category as NameValue } from'../model/category';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  @Input()
  sku:number;
  @Input()
  products: ProductData[];
  product: ProductData;

  @Output('outproduct')
  outproduct: EventEmitter<any> = new EventEmitter();
  @Input("categories")
  categories:NameValue[];
  currencies:NameValue[];

  editMode: boolean = false;
  public productForm: FormGroup;
  defaultCategory:string="1";
  filteredCategories: Observable<any[]>;
  filteredProducts: Observable<any[]>;
  author: string;
  public edit_product: Subject<any>;
  constructor(private fb: FormBuilder, private productService: ProductService, 
    private authService: AuthService, private router: Router) {
    this.currencies=[];
    this.outproduct = new EventEmitter();
    this.currencies.push(new NameValue('USD','$'))
    let user = sessionStorage.getItem('user');
    if (!user) this.router.navigate(['login']);
    let userObj: any = JSON.parse(user);
    this.author = userObj.username;
   
  }
  initializeControlValues(){
    this.productForm.controls.category_id.setValue(this.product.category_id);
    this.productForm.controls.availableSizes.setValue(this.product.availableSizes.join(','));
    this.productForm.controls.description.setValue(this.product.description);
    this.productForm.controls.sku.setValue(this.product.sku);
    this.productForm.controls.currencyFormat.setValue(this.product.currencyFormat);
    this.productForm.controls.style.setValue(this.product.style);
    this.productForm.controls.price.setValue(this.product.price);
    this.productForm.controls.title.setValue(this.product.title);
    this.productForm.controls.isFreeShipping.setValue(this.product.isFreeShipping);
    
  }
  ngOnInit() {
    if(this.sku)
    this.product=this.products.find(a=>a.sku==this.sku);
    else
      this.product=new ProductData();
    this.outproduct.emit({ product: this.product });
    this.productForm = this.fb.group(new ProductData() as any);
    this.initializeControlValues();
    this.productForm.controls.category_id.valueChanges.subscribe(e=>{
      this.product.category_id = this.productForm.controls.category_id.value;
      this.product.category = this.categories.find(a => a.value == this.product.category_id).text;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.availableSizes.valueChanges.subscribe(e => {
      this.product.availableSizes = this.productForm.controls.availableSizes.value.split(',');
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.description.valueChanges.subscribe(e => {
      this.product.description = this.productForm.controls.description.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.sku.valueChanges.subscribe(e => {
      this.product.sku = this.productForm.controls.sku.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.currencyFormat.valueChanges.subscribe(e => {
      this.product.currencyFormat = this.currencies.find(a => a.value == this.productForm.controls.currencyFormat.value).text;
      this.product.currencyId = this.productForm.controls.currencyFormat.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
  
    this.productForm.controls.style.valueChanges.subscribe(e => {
      this.product.style = this.productForm.controls.style.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.price.valueChanges.subscribe(e => {
      this.product.price = this.productForm.controls.price.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.title.valueChanges.subscribe(e => {
      this.product.title = this.productForm.controls.title.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });
    });
    this.productForm.controls.isFreeShipping.valueChanges.subscribe(e => {
      this.product.isFreeShipping = this.productForm.controls.isFreeShipping.value;
      console.log(this.product)
      this.outproduct.emit({ product: this.product });

    });
 
    
   
  }
  uploadComplete(uploaded) {
    console.log('at detail after uploaded');
    console.log(uploaded);
    if (!this.product.sku){
      this.product.sku = uploaded.sku;
      this.sku=uploaded.sku;
     // alert('upload complete'+this.sku)
      this.productForm.controls.sku.setValue(uploaded.sku);
    }
    this.product.imageUrls.push(uploaded.url);
    this.outproduct.emit({ product: this.product});
  }

  removeImage(imgurl){
    this.product.imageUrls = this.product.imageUrls.filter(url=>url!=imgurl);
  }

}
