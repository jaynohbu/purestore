import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  hasError: boolean;

  filteredCountries: Observable<any[]>;
  filteredLanguages: Observable<any[]>;
  activityId: string;
  signupmode: boolean;
  error: string = "";
  constructor(private fb: FormBuilder, private authService: AuthService, public router: Router, private route: ActivatedRoute){

    this.route.queryParams.subscribe(params => {
      this.activityId = params['course'];
    });
    this.loginForm = fb.group({
      username: "",
      password: ""
    });
  }
  validate() {
    if (!this.loginForm.controls.username.value) {
      this.hasError = true;
      this.error = "Your email is required.";
      return false;
    }
    if (!this.loginForm.controls.password.value) {
      this.hasError = true;
      this.error = "Your password is required.";
      return false;
    }
    return true;

  }

  forgot() {
    if (this.loginForm.controls.username.value)
      this.authService.forgot(this.loginForm.controls.username.value);
    else {
      this.hasError = true;
      this.error = "Please provide your email/username.";
    }
  }
  async login() {
    sessionStorage.clear();
    this.hasError = false;
    if (this.validate())
      this.authService.authenticate(this.loginForm.controls.username.value, this.loginForm.controls.password.value).then((user) => {
        console.log(user)
        this.router.navigate(['dashboard']);
      }).catch((err) => {
        this.hasError = true;
        this.error = err.message;
      });
  }
  public resetContent() {
    this.loginForm = this.fb.group({
      username: "",
      password: ""
    });
  }
  goHome() {
    this.router.navigate(['']);
  }
  ngOnInit() {
    this.resetContent();
    document.body.addEventListener("click", (e) => {
      let element = e.target as HTMLElement;

      if (element.classList.contains("ct-close-x") || element.classList.contains("login-input")) {
        this.hasError = false;
        this.error = "";
      }


    })


  }


}
