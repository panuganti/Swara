import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { NursingLog, TimeVol } from '../../library/entities';
import * as moment from 'moment';

@Component({
  selector: 'page-feeding',
  templateUrl: 'feeding.html'
})
export class FeedingPage {
  feedingVolume: number;
  feedingType: string = 'breastfeeding';
  id: string;

  constructor(public navCtrl: NavController, public fbs: FirebaseService,
    public navParams: NavParams, public viewCtrl: ViewController) {
  }

  getDate() {
    return moment().subtract(15, 'm').format();
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
    if (this.navParams.get('feedingType')) {
      this.feedingType = this.navParams.get('feedingType');
    }
    if (this.navParams.get('feedingVolume')) {
      this.feedingVolume = this.navParams.get('feedingVolume');
    }
  }

  getVolumeLabel(type): string {
    switch (type) {
      case 'breastfeeding': return 'Duration(in mins)';
      case 'pumped': return 'Volume (in ml)';
      case 'formula': return 'Volume (in ml)';
      default: return 'Volume (in ml)';
    }
  }

  saveFeeding(ev: TimeVol, editType, key) {
    let log: NursingLog = { type: this.feedingType, volume: ev.volume, time: ev.time, date: ev.date, note: ev.note };
    this.fbs.push_nursing_log(this.id, log);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
