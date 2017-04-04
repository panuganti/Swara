import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as firebase from 'firebase';
import { FirebaseListObservable, AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { ProfilesPage } from '../profiles/profiles';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string;
  password: string;
  existing: boolean = true;
  error: string;
  users: FirebaseListObservable<any>;
  showSpinnie: boolean = false;
  showError: boolean = false;
  showForgotPasswd: boolean = false;

  constructor(public navCtrl: NavController, public af: AngularFire) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.setRoot(ProfilesPage);
      } else {
        // No user is signed in.
      }
    });
  }

  ionViewDidLoad() {
  }

  forgotpasswd() {
    let promise = firebase.auth().sendPasswordResetEmail(this.email.trim());
    promise.then(() => {
      this.error = 'Please check your email for resetting your password';
      this.showError = true;
    });
    promise.catch((err) => {
      this.handleAuthError(err, 'forgotpasswd');
    });
  }

  login() {
    this.showSpinnie = true;
    let promise = this.af.auth.login({ email: this.email.trim(), password: this.password },
      { provider: AuthProviders.Password, method: AuthMethods.Password });
    promise.catch((err: any) => {
      console.log(err);
      this.showSpinnie = false;
      this.handleAuthError(err, 'login');
    });
  }

  signup() {
    this.showSpinnie = true;
    let promise = this.af.auth.createUser({ email: this.email.trim(), password: this.password });
    promise.catch((err: any) => {
      console.log(err);
      this.showSpinnie = false;
      this.handleAuthError(err, 'signup');
    });
  }

  resetErrors() {
    this.error = '';
    this.showError = false;
    this.showForgotPasswd = false;
  }

  handleAuthError(err: any, method: string) {
    this.password = '';
    if (err.code == 'auth/network-request-failed') {
      this.error = "Unable to connect to server. Try again after some time";
    }
    else if (method == 'login' && err.code == 'auth/user-not-found') {
      this.error = "No such  user with the email provided. Uncheck \"I'm existing user\" to sign up ";
    }
    else if (method == 'signup' && err.code == 'auth/weak-password') {
      this.error = err.message;
    }
    else if (method == 'signup' && err.code == 'auth/email-already-in-use') {
      this.error = "Already signed up. Please check I'm Existing User to Sign in";
    }
    else if (err.code == 'invalid-email') {
      this.error = "Invalid Email";
    }
    else if (method == 'login' && err.code == 'auth/wrong-password') {
      this.error = "Wrong Password";
      this.showForgotPasswd = true;
    }
    else {
      this.error = err.message;
    }
    this.showError = true;
  }
}
