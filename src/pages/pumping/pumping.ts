import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { PumpingLog,  Time } from '../../library/entities';
import * as moment from 'moment';

@Component({
  selector: 'page-pumping',
  templateUrl: 'pumping.html'
})
export class PumpingPage {
  pumpingDate: string;
  both_volume: number;
  left_volume: number;
  right_volume: number;
  date: string;
  time: string;
  id: string;
  notes: string;
  seperate: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fbs: FirebaseService, public viewCtrl: ViewController) { }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  getDate() {
    let datetime = moment().subtract(15, 'm').format();
    this.date = datetime;
    this.time = datetime;
    return datetime;
  }

  updatetimedate(ev: Time) {
    this.time = ev.time;
    this.date = ev.date;
  }

  savePumping() {
    let log: PumpingLog = { type: this.seperate ? 'seperate' : 'both', volume: this.both_volume, left_volume: this.left_volume, right_volume: this.right_volume, time: this.time, date: this.date, note: this.notes };
    this.fbs.push_pumping_log(this.id, log);
    this.viewCtrl.dismiss();
  }
}
