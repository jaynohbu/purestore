import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from 'aws-amplify';
@Injectable()
export class UploadService {
  url: string;
  loaded: number = 0;
  total: number = 0;
  key: string;
  headers: HttpHeaders;
 constructor(private http: HttpClient) {
  
    Auth.currentSession().then(CognitoUserSession => {
      let token = CognitoUserSession.getIdToken().getJwtToken();
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      });
    });
  }
  private updateProgress(progress: Subject<any>) {
    var percentDone = Math.round(100 * this.loaded / this.total);
    if (percentDone == 100) percentDone = 99;
    progress.next({ done: percentDone, key: '' });
  }
  private completeProgress(progress: Subject<any>) {
    progress.next({ done: 100, key: this.key });
    progress.complete();
    console.log('upload completed')
  }

  public upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let url = `${environment.API_ENDPOINT}/upload`;
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });
    const progress = new Subject<any>();
    let serviceCall = this.http.request(req);
    serviceCall.subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.loaded = event.loaded;
        this.total = event.total;
        this.updateProgress(progress);
      } else if (event instanceof HttpResponse) {
        let body = event.body as any;
        console.log(body)
        this.key = body.key;
        this.loaded = this.total;
        this.completeProgress(progress);
      } else if (event instanceof HttpErrorResponse) {
        console.log(JSON.stringify(event));
      }
    })
    return progress.asObservable();
  }

}