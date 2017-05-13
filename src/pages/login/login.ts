import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FirebaseListObservable} from 'angularfire2';
import { SMS } from "@ionic-native/sms";
import { Utils } from '../../library/utils';
//import { HomePage } from '../home/home';
import { User } from '../../library/entities';
import { FirebaseService } from '../../providers/firebase-service';

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
  attempt: number = 0;

  constructor(public navCtrl: NavController, public fbs: FirebaseService,
    public sms: SMS, public utils: Utils, public view: ViewController) {
  }

  generate_secret_code(): number {
    var min = 100000; var max = 999999;
    return min + Math.round(Date.now() % (max - min) * Math.random());
  }

  async send_secret_code_sms(): Promise<any> {
    var secret = this.generate_secret_code();
    try {
      var succ = await this.sms.send(this.phone.toString(), 'Your secret code is: ' + secret);
      if (succ != 'OK') {
        // TODO: Failed to send sms. Log error
        console.log('SMS sending failed');
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
    var secret = window.localStorage.getItem('secret');
    if (this.code != secret) {
      // Handle User code not same as secret; 
      return;
    }
    var phone = window.localStorage.getItem('phone');
    if (phone && secret) {
      await this.create_user();
    }
  }

  show_verification_error() {
    this.showError = true;
    this.error = "User code not same as secret";
  }

  async create_user() {
    try {
      var phone = window.localStorage.getItem('phone');
      var secret = window.localStorage.getItem('secret');
      let email_from_phone: string = this.utils.email_from_phone(phone, this.attempt);
      await this.fbs.create_user(email_from_phone, secret);
      window.localStorage.setItem('email_from_phone', email_from_phone);
      await this.add_user();
      this.view.dismiss();
    }
    catch (err) {
      // TODO: Firebase throwing error
      await this.handleAuthErrorAsync(err, 'signup');
    }
  }

  async add_user() {
    try {
      var phone = window.localStorage.getItem('phone');
      var users = await this.fbs.get_users_once();
      if (users == null) {return;}
      var new_user: User = { phone: phone, email: this.email };
      await this.fbs.get_users().push(new_user);
    }
    catch (err) {
      console.log(err);
    }
  }

  async handleAuthErrorAsync(err: any, method: string) {
    if (method == 'signup' && err.code == 'auth/email-already-in-use') {
      this.attempt++;
      await this.create_user();
    }
    if (err.code == 'auth/network-request-failed') {
      this.error = "Unable to connect to server. Try again after some time";
    }
    else if (method == 'login' && err.code == 'auth/user-not-found') {
      this.error = "No such  user with the email provided. Uncheck \"I'm existing user\" to sign up ";
    }
    else if (method == 'signup' && err.code == 'auth/weak-password') {
      this.error = err.message;
    }
    else if (err.code == 'invalid-email') {
      this.error = "Invalid Email";
    }
    else if (method == 'login' && err.code == 'auth/wrong-password') {
      this.error = "Wrong Password";
    }
    else {
      this.error = err.message;
    }
    this.showError = true;
  }
}
