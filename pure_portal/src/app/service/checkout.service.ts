


import { Injectable } from '@angular/core';

import { HttpClient, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  headers: HttpHeaders;
  constructor(private http: HttpClient) {

    // Auth.currentSession().then(CognitoUserSession => {
    //   let token = CognitoUserSession.getIdToken().getJwtToken();
    //   this.headers = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': token
    //   });
    // });
  }

  public getCheckout(key): Observable<HttpEvent<any>> {
    let url = environment.API_ENDPOINT + environment.PATH_GET_CHECKOUT;
    url = url.replace('{0}', key);
    let options = { headers: this.headers };
    const req = new HttpRequest('GET', url, {}, options);
    return this.http.request(req);
  }

}




