import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-feeding',
  templateUrl: 'feeding.html'
})
export class FeedingPage {
feedingDate: string;
feedingVolume: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
  }

getVolumeLabel(type): string {
  switch(type) {
    case 'breastfeeding': return 'Duration(in mins)';
    case 'pumped': return 'Volume (in ml)';
    case 'formula': return 'Volume (in ml)';
    default: return 'Volume (in ml)';
  }
}

saveFeeding(ev, editType, key) {
  // dismiss with data
}

}
