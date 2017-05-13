import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-diaper',
  templateUrl: 'diaper.html'
})
export class DiaperPage {
diaperDate: string;
diaperType: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
  }

saveDiaper(ev, editType, key) {
  // Dismiss with data
}

}
