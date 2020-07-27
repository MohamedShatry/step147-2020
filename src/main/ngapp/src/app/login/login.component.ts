import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginAwait = false;
  error: any;
  errorPresent: boolean = false;
  constructor(public authService: AuthService, private router: Router, public http: HttpClient) {}

  ngOnInit(): void {}

  login(email: string, password: string): void {
    this.loginAwait = true;
    this.authService
      .login(email, password)
      .then((res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));

        // Calling firebase.auth() to get idToken that will be sent to the filter in the backend
        // for authentication using FirebaseApp SDK. The idToken is stored in localStorage.
        firebase.auth().currentUser.getIdToken()
            .then((idToken) => {
            localStorage.setItem('idToken', idToken);
            console.log('idToken in login', localStorage.idToken);
        });


        this.loginAwait = false;
        this.router.navigate(['/chat']);
      }) 
      .catch((error: any) => {
        this.loginAwait = false;
        this.errorPresent = true;
        this.error = error.message;
      });
  }

  onClose() {
    this.errorPresent = false;
  }

  sendPasswordResetEmail(email: string) {
    this.authService.sendPasswordResetEmail(email);
  }

  routerSplit(res: any) {
    if (res.additionalUserInfo.isNewUser) {
      this.router.navigate(['/select-language']);
    } else {
      this.router.navigate(['/chat']);
    }
  }

  loginWithGoogle() {
    this.authService
      .googleAuth()
      .then((res) => {
        this.routerSplit(res);
      })
      .catch((error: any) => {
        this.errorPresent = true;
        this.error = error.message;
      });
  }

  loginWithFacebook() {
    this.authService
      .facebookAuth()
      .then((res) => {
        this.routerSplit(res);
      })
      .catch((error: any) => {
        this.errorPresent = true;
        this.error = error.message;
      });
  }
}