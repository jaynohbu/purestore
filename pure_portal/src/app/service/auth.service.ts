import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logOut() {
    Auth.signOut({ global: true })
      .then(data => { })
      .catch(err => console.log(err));
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  forgot(username) {
    sessionStorage.setItem('email', username);
    Auth.forgotPassword(username)
      .then(data => { this.router.navigate([`passwordreset/true`]); })
      .catch(err => console.log(err));

  }
  constructor(private router: Router) {


  }
  public async isAuthenticated(): Promise<boolean> {
    try {
      let user = await Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      });
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  public authenticate(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password).then((user) => {
        sessionStorage.setItem('username', username);
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          Auth.completeNewPassword(
            user,               // the Cognito User Object
            password.split('').reverse().join(''),       // the new password
            // OPTIONAL, the required attributes
            {

            }
          ).then(user2 => {
          
            Auth.forgotPassword(username)
              .then(data => { this.router.navigate([`passwordreset/true`]); })
              .catch(err => console.log(err));
            return resolve(user2);
          }).catch(e => {
            return reject(e)
          });
          return resolve(1);
        } else {

          sessionStorage.setItem('user', JSON.stringify(user));
          return resolve(user);
        }
      }).catch((err) => {
        if (err.code === 'UserNotConfirmedException') {
          // The error happens if the user didn't finish the confirmation step when signing up
          // In this case you need to resend the code and confirm the user
          // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
          sessionStorage.setItem('email', username);
          Auth.forgotPassword(username)
            .then(data => { this.router.navigate([`passwordreset/true`]); })
            .catch(err => console.log(err));

        } else if (err.code === 'NotAuthorizedException') {
          // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
          // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
          console.log(err);
        }
        return reject(err)
      }
      ).finally(() => reject({ message: "unknown error" }));
    })
  }
  public resetPassword(username, code, new_password) {
    return Auth.forgotPasswordSubmit(username, code, new_password);
  }
  




}