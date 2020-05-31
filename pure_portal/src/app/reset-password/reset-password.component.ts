import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hasCode: string;
  hasError: boolean;


  error: string = "";
  public resetForm: FormGroup;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService,
    private router: Router) {
    this.resetFormGrp();
    this.resetForm.controls.username.setValue(sessionStorage.getItem('username'));

  }
  resetFormGrp() {
    this.resetForm = this.fb.group({
      username: "",
      password: "",
      repassword: "",
      code: ""
    });
  }
  validate() {
    if (!this.resetForm.controls.username.value) {
      this.hasError = true;
      this.error = "Your email is required.";
      return false;
    }
    if (!this.resetForm.controls.password.value) {
      this.hasError = true;
      this.error = "Your password is required.";
      return false;
    }
    if (!this.resetForm.controls.code.value && this.hasCode === 'true') {
      this.hasError = true;
      this.error = "Your verification code is required.";
      return false;
    }
    if (this.resetForm.controls.password.value !== this.resetForm.controls.repassword.value) {
      this.hasError = true;
      this.error = "Your password is required.";
      return false;
    }
    return true;

  }
  ngOnInit() {

    this.route.params.subscribe(params => {
      this.hasCode = params['hascode'];
      let username = sessionStorage.getItem('email');
      this.resetForm.controls.username.setValue(username);
    });

  }
  goHome() {
    this.router.navigate(['']);
  }

  submit() {
    if (this.hasCode === 'true')
      this.authService.resetPassword(this.resetForm.controls.username.value, this.resetForm.controls.code.value, this.resetForm.controls.password.value).then(() => {
        this.authService.authenticate(this.resetForm.controls.username.value, this.resetForm.controls.password.value).then(() => {

          this.router.navigate(['dashboard']);
        }).catch((err) => {
          this.hasError = true;
          this.error = err.message;
        });
      }).catch((err) => {
        this.hasError = true;
        this.error = err.message;
      });
    else if (this.hasCode != 'true'){}
      // this.authService.newpassword(this.resetForm.controls.username.value, this.resetForm.controls.password.value).then((user) => {
      //   this.router.navigate(['dashboard']);
      // }).catch((err) => {
      //   this.hasError = true;
      //   this.error = err.message;
      // });
  }



}
