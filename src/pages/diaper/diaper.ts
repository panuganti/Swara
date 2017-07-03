import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase-service';
import { DiaperLog } from '../../library/fb-entities';
import * as moment from 'moment';

@Component({
  selector: 'page-diaper',
  templateUrl: 'diaper.html'
})
export class DiaperPage {
  diaperDate: string;
  diaperType: string;
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public fbs: FirebaseService) { }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  getDate() {
    return moment().subtract(15, 'm').format();
  }

  saveDiaper(ev, editType, key) {
    let log: DiaperLog = { type: this.diaperType,  time: ev.time, date: ev.date, note: ev.note, $ref:'hello' };
    this.fbs.push_diaper_log(this.id, log);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
