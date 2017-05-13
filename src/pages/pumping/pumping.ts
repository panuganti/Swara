import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pumping',
  templateUrl: 'pumping.html'
})
export class PumpingPage {
pumpingDate: string;
pumpingVolume: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
  }

  savePumping(ev, editType, key) {
    // save and dismiss
  }
}
