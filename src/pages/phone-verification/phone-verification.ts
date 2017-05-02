import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SMS } from "@ionic-native/sms";

@Component({
  selector: 'page-phone-verification',
  templateUrl: 'phone-verification.html'
})
export class PhoneVerificationPage {
code_generation: boolean = true;
phone: string;
code: string;
has_sms_permission: boolean = true;

  constructor(public navCtrl: NavController, public sms: SMS) {}

  ionViewDidLoad() {  }

async onInputKeypress({keyCode}: KeyboardEvent): Promise<any> {
    if (keyCode === 13) {
      if (this.code_generation) {
        await this.sendSecretCode();
      }
      else {
        await this.verify();
      }
    }
  }

async sendSecretCode(): Promise<any> {
    var secret = this.generate_secret_code();
    try {
    var succ = await this.sms.send(this.phone, 'Your secret code is: ' +  secret);
    if (succ != 'OK') {
      // Failed to send sms. Log error
    }
    this.code_generation = false;
    window.localStorage.setItem('secret',JSON.stringify(secret));
  }
  catch(err) {
    var has_permission = await this.sms.hasPermission();
    if (!has_permission) {
      this.has_sms_permission = has_permission;
    }
    else {
      // Something seriously wrong. Report error.
    }
  }
}
  
   verify() {
      var secret = JSON.parse(window.localStorage.getItem('secret'));
      if (this.code == secret) {
        console.log('success');
      }
      else {
        // re-enter or resend
        console.log(secret);
      }     
   } 

   generate_secret_code(): number {
     var min = 1000;
     var max = 9999;
    var date = new Date();
    var now: number = date.getMilliseconds();
    var seed: number = now % (max - min);
    return min + Math.round(seed * Math.random());
  }

}
