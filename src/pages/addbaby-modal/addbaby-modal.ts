import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-addbaby-modal',
  templateUrl: 'addbaby-modal.html'
})
export class AddbabyModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public viewCtrl: ViewController) {}

  ionViewDidLoad() {
  }

  added() {
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
