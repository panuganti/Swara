import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
//import * as firebase from 'firebase';
import { SMS } from "@ionic-native/sms";
import { Utils } from '../../library/utils';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string;
  phone: number;
  code: string;
  secret: string;
  error: string;
  users: FirebaseListObservable<any>;
  showSpinnie: boolean = false;
  showError: boolean = false;
  code_generation: boolean = true;
  verify_code: boolean = false;
  has_sms_permission: boolean = true;

  constructor(public navCtrl: NavController, public af: AngularFire,
    public sms: SMS, public utils: Utils) {
  }

  generate_secret_code(): number {
    var min = 100000; var max = 999999;
    var now: number = (new Date()).getMilliseconds();
    return min + Math.round(now % (max - min) * Math.random());
  }

  async send_secret_code_sms(): Promise<any> {
    var secret = this.generate_secret_code();
    try {
      var succ = await this.sms.send(this.phone.toString(), 'Your secret code is: ' + secret);
      if (succ != 'OK') {
        // Failed to send sms. Log error
      }
      this.code_generation = false;
      this.verify_code = true;
      window.localStorage.setItem('secret', secret.toString());
      window.localStorage.setItem('phone', this.phone.toString());
    }
    catch (err) {
      var has_permission = await this.sms.hasPermission();
      if (!has_permission) {
        this.has_sms_permission = has_permission;
      }
      else {
        // Something seriously wrong. Report error.
      }
    }
  }

  async verify() {
    var phone = window.localStorage.getItem('phone');
    var secret = window.localStorage.getItem('secret');
    if (this.code != secret) {
      // Handle User code not same as secret; 
      return;
    }
    if (phone && secret) {
      try {
        var email = 'User' + phone.toString() + '@trackbabyvitals.com';
        await this.af.auth.createUser({ email: email, password: secret });
          this.navCtrl.setRoot(HomePage);
      }
      catch (err) {
        // TODO: Firebase throwing error
        console.log(err);
      }
    }
  }

/*
  handleAuthError(err: any, method: string) {
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
  */
}
