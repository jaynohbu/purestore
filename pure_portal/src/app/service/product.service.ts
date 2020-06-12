import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilityService, Code } from './utility.service';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  headers: HttpHeaders;
  countries: Code[];
  languages: Code[];
  constructor(private http: HttpClient, private utilityService: UtilityService) {
    this.countries = utilityService.getCountryCodes();
    this.languages = utilityService.getLanguageCodes();
    Auth.currentSession().then(CognitoUserSession => {
      let token = CognitoUserSession.getIdToken().getJwtToken();
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });
    });
  }

 

  public getAllProducts(): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/products'
    let options = { headers: this.headers };
    const req = new HttpRequest('GET', url, {}, options);
    return this.http.request(req);
  }
  public getAllProductCategores(): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/categories'
    let options = { headers: this.headers };
    const req = new HttpRequest('GET', url, {}, options);
    return this.http.request(req);
  }

  public createProduct(Product): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/product'
    let options = { headers: this.headers };
    const req = new HttpRequest('POST', url, Product, options);
    return this.http.request(req);
  }
  public createProductCategory(category): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/category';
    let options = { headers: this.headers };
    const req = new HttpRequest('POST', url, category, options);
    return this.http.request(req);
  }

  public getProductBySku(sku: string) {
    let url = environment.API_ENDPOINT + '/sku/' + sku;
    let options = { headers: this.headers };
    const req = new HttpRequest('GET', url, {}, options);
    return this.http.request(req);
  }

  public updateProduct(Product): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/product';
    let options = { headers: this.headers };
    const req = new HttpRequest('PUT', url, {product:Product}, options);
    return this.http.request(req);
  }
  public updateProductCategory(category): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/category';
    let options = { headers: this.headers };
    const req = new HttpRequest('PUT', url, category, options);
    return this.http.request(req);
  }
 

  public deleteProduct(sku): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + '/product';
    let options = { headers: this.headers };
    const req = new HttpRequest('DELETE', url, {sku:sku}, options);
    return this.http.request(req);
  }
 
  public getCountryCodeByText(text): Code {
    let code: Code;
    this.countries.forEach(a => {
      if (a.text.toLowerCase().trim() == text.toLowerCase().trim()) code = a;
    });
    return code;
  }
  public getLanguageCodeByText(text): Code {
    let code: Code;
    this.languages.forEach(a => {
      if (a.text.toLowerCase().trim() == text.toLowerCase().trim()) code = a;
    });
    return code;
  }
  public getCountryCodeByValue(value): Code {
    let code: Code;
    this.countries.forEach(a => {
      if (a.code.toLowerCase().trim() == value.toLowerCase().trim()) code = a;
    });
    return code;
  }
  public getLanguageCodeByValue(value): Code {
    let code: Code;
    this.languages.forEach(a => {
      if (a.code.toLowerCase().trim() == value.toLowerCase().trim()) code = a;
    });
    return code;
  }
}




