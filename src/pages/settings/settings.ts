import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
send_notifications: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    let notifications = JSON.parse(window.localStorage.getItem('send_notifications'));
    if (notifications) {
      this.send_notifications = notifications;
    }
  }

  notifications_changed() {
    window.localStorage.setItem('send_notifications', JSON.stringify(this.send_notifications));
  }

}
