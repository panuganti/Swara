import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert, ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { TimeVolType, TimeVol, Diaper } from '../../library/entities';

import { ProfilesPage } from '../profiles/profiles';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoginPage } from '../login/login';
import { FeedingPage } from '../feeding/feeding';
import { DiaperPage } from '../diaper/diaper';
import { PumpingPage } from '../pumping/pumping';

import { Utils } from '../../library/utils';
import { MyBaby, Baby } from '../../library/entities';

import * as Enumerable from 'linq';
import * as moment from 'moment';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  babySelector: Alert;
  baby: Baby;
  id: string;
  feedingAlert: Alert;
  pumpingAlert: Alert;
  diaperAlert: Alert;
  log: FirebaseListObservable<any>;
  pageDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public af: AngularFire, public localNotifications: LocalNotifications, public utils: Utils, public modal: ModalController) {
    this.init();
  }

  async init() {
    this.id = this.navParams.get("id");
    this.pageDate = moment().format();
    this.set_default(this.id, this.pageDate);
  }

  changeBaby() {
    this.babySelector.present();
  }

  async create_baby_selector(babies: MyBaby[], id?: string): Promise<Alert> {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Baby');
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => { this.set_default(data); }
    });
    Enumerable.from(babies).select(async b => {
      let baby: Baby = await this.af.database.list('/Babies/' + b.babyid).$ref.once('value');
      alert.addInput({
        type: 'radio', label: baby.name, value: b.babyid, checked: (id != null && id == b.babyid) ? true : b.default
      })
    }).toArray();
    return alert;
  }

  mybabies: MyBaby[]; // TODO: Move to singleton
  // Set baby, and selector; Load all data
  async set_default(id?: string, date?: string) {
    let user = firebase.auth().currentUser;
    this.mybabies = await this.af.database
      .list('/Babies' + '_' + this.utils.sanitize_email(user.email)) // TODO: Change to phone
      .$ref.once('value');

    this.babySelector = await this.create_baby_selector(this.mybabies, id); 
    await this.set_baby();
  }

  async set_baby() {
    if (Enumerable.from(this.mybabies).any(b => b.default)) {
      this.id = Enumerable.from(this.mybabies).first(b => b.default).babyid;
      this.baby = await this.af.database.list('/Babies/' + this.id).$ref.once('value');
    }
    await this.resetLists();
  }

  async resetLists() {
    var query = { orderByChild: "date", equalTo: this.getDate(this.pageDate) };
    var yestquery = { orderByChild: "date", equalTo: this.getDate(moment(this.pageDate).subtract(1, 'd').format()) };
    this.log = this.af.database.list('/Log_' + this.id, { query: query });
    let yestlog = await this.af.database.list('/Log_' + this.id, { query: yestquery }).$ref.once('value');
  }

  create_feeding_dialog() {
    let feedingModal = this.modal.create(FeedingPage);
    feedingModal.onDidDismiss((data) => {console.log(data);
      this.log.push(data);
    });
    feedingModal.present();
  }

  create_diaper_dialog() {
    let diaperModal = this.modal.create(DiaperPage);
    diaperModal.onDidDismiss((data) => {console.log(data);
          this.log.push(data);
    });
    diaperModal.present();    
  }

  create_pumping_dialog() { 
    let pumpingModal = this.modal.create(PumpingPage);
    pumpingModal.onDidDismiss((data) => {console.log(data); 
          this.log.push(data);
    });
    pumpingModal.present();        
  }

  async create_alarm_dialog() { }


  setDate(ev) {
    this.pageDate = ev;
    this.resetLists();
  }

  getDate(d: string): string {
    var m = moment(d);
    var datestring = '' + m.year() + m.month() + m.day();
    return datestring;
  }



  showAlarm(type) {
    this.showAlarmCard = true;
    this.alarmTime = moment().add(3, 'h').format();
    this.alarmNote = '';
  }

  showAlarmCard: boolean = false;
  alarmTime: string;
  alarmNote: string;
  setAlarm(type: string) {
    this.localNotifications.schedule({
      id: 1, text: this.alarmNote, at: new Date(this.alarmTime),
      led: 'FF0000', title: type
    });
    this.showAlarmCard = true;
  }

  formatTime(time: string): string {
    console.log(time);
    return moment(time).format('HH:mm a')
  }

  //#endregion Feeding

  getAge(baby: any): number {
    if (baby == null) { return 0; }
    var dob = baby.dob;
    var now = moment(Date.now());
    var dobMoment = moment(dob);
    var duration = moment.duration(now.diff(dobMoment));
    var ageInDays = Math.floor(duration.asDays());
    return ageInDays;
  }

  // #region Summary
  getLastFeedType(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if ((feeding != null) && (Enumerable.from(feeding).count() > 0)) {
      this.showNoFeedingText = false;
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      var type = lastelement.type;
      switch (type) {
        case 'pumped': return 'Pumped ' + lastelement.volume + ' ml ';
        case 'breastfeeding': return 'Breast-fed for ' + lastelement.volume + ' mins ';
        case 'formula': return 'Fed formula ' + lastelement.volume + ' ml ';
        default: return '';
      }
    }
    return '';
  }

  showNoFeedingText: boolean = false;
  getLastFeedTime(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if (feeding == null || (Enumerable.from(feeding).count() == 0)) {
      if (yestfeeding == null || (Enumerable.from(yestfeeding).count() == 0)) {
        this.showNoFeedingText = true;
        return '';
      }
      else {
        this.showNoFeedingText = false;
        var lastelement = Enumerable.from(yestfeeding).orderByDescending(f => moment(f.time).valueOf()).first();
        return this.getTimeInHoursAndMins(lastelement.time);
      }
    }
    else {
      this.showNoFeedingText = false;
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      return this.getTimeInHoursAndMins(lastelement.time);
    }
  }

  getTimeInHoursAndMins(time: string): string {
    var d = moment.duration(moment().diff(moment(time)));
    var h = Math.floor(d.asHours());
    var m = Math.floor(d.asMinutes() - h * 60);
    if (h == 0) { return '' + m + ' mins ago'; }
    return '' + h + ' hrs and ' + m + ' mins ago';
  }

  showBabies() {
    console.log('in show babies');
    this.navCtrl.push(ProfilesPage); // TODO: Make it modal
  }

  showNoPumpingText: boolean = true;
  getLastPumpedTime(pumping: TimeVolType[], yestpumping: TimeVolType[]): string {
    if (pumping == null || (Enumerable.from(pumping).count() == 0)) {
      if (yestpumping == null || (Enumerable.from(yestpumping).count() == 0)) {
        this.showNoPumpingText = true;
      }
      else {
        this.showNoPumpingText = false;
        var lastelement = Enumerable.from(yestpumping).orderByDescending(f => moment(f.time).valueOf()).first();
        return 'Pumped ' + this.getTimeInHoursAndMins(lastelement.time);
      }
    }
    else {
      this.showNoPumpingText = false;
      var lastelement = Enumerable.from(pumping).orderByDescending(f => moment(f.time).valueOf()).first();
      return 'Pumped ' + this.getTimeInHoursAndMins(lastelement.time);
    }
  }

  /*
    toggleFeeding() {
      this.expandFeedingList = !this.expandFeedingList;
    }
    togglePumping() {
      this.expandPumpingList = !this.expandPumpingList;
    }
    toggleDiapering() {
      this.expandDiaperList = !this.expandDiaperList;
    }
  */

  getUnits(feed: any): string {
    if (feed.type == 'breastfeeding') {
      return 'mins';
    }
    else {
      return 'ml';
    }
  }

  /*
    getDiaperType(diaper: Diaper[], yestdiaper: Diaper[]): string {
      if (diaper == null || (Enumerable.from(diaper).count() == 0)) {
        if (yestdiaper == null || (Enumerable.from(yestdiaper).count() == 0)) {
          this.showNoDiaperText = true;
        }
        else {
          this.showNoDiaperText = false;
          var lastelement = Enumerable.from(yestdiaper).orderByDescending(f => moment(f.time).valueOf()).first();
          return 'Previous Diaper was ' + lastelement.type;
        }
      }
      else {
        this.showNoDiaperText = false;
        var lastelement = Enumerable.from(diaper).orderByDescending(f => moment(f.time).valueOf()).first();
        return 'Previous Diaper was ' + lastelement.type;
      }
    }
  
    getPreviousDiaperTime(diaper: Diaper[], yestdiaper: Diaper[]) {
      if (diaper == null || (Enumerable.from(diaper).count() == 0)) {
        if (yestdiaper == null || (Enumerable.from(yestdiaper).count() == 0)) {
          this.showNoDiaperText = true;
        }
        else {
          this.showNoDiaperText = false;
          var lastelement = Enumerable.from(yestdiaper).orderByDescending(f => moment(f.time).valueOf()).first();
          return ' and was changed ' + this.getTimeInHoursAndMins(lastelement.time);
        }
      }
      else {
        this.showNoDiaperText = false;
        var lastelement = Enumerable.from(diaper).orderByDescending(f => moment(f.time).valueOf()).first();
        return ' and was changed ' + this.getTimeInHoursAndMins(lastelement.time);
      }
    }
  */
  // #endregion Summary


}
