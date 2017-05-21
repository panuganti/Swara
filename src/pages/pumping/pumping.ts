import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { PumpingLog, TimeVol } from '../../library/entities';
import * as moment from 'moment';

@Component({
  selector: 'page-pumping',
  templateUrl: 'pumping.html'
})
export class PumpingPage {
pumpingDate: string;
pumpingVolume: number;
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public fbs: FirebaseService, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  getDate() {
    return moment().subtract(15, 'm').format();
  }

  savePumping(ev: TimeVol, editType, key) {
    let log: PumpingLog = { type: 'both', volume: ev.volume, time: ev.time, date: ev.date, note: ev.note };
    this.fbs.push_pumping_log(this.id, log);
    this.viewCtrl.dismiss();
  }
}
