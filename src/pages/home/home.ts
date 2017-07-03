import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert, ModalController} from 'ionic-angular';
import { TimeVolType, MyBaby, Baby  } from '../../library/fb-entities';

import { ProfilesPage } from '../profiles/profiles';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FeedingPage } from '../feeding/feeding';
import { DiaperPage } from '../diaper/diaper';
import { PumpingPage } from '../pumping/pumping';

import { Utils } from '../../library/utils';
import { FirebaseService } from '../../providers/firebase-service';

import { Observable } from 'rxjs/Rx';
import * as Enumerable from 'linq';
import * as moment from 'moment';

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
  log: Observable<any>;
  pageDate: string;
  babyname: string;
  babyImg: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public fbs: FirebaseService, public localNotifications: LocalNotifications, public utils: Utils, public modal: ModalController) {
    this.init();
  }

  async init() {
    this.id = this.navParams.get("id");
    this.pageDate = moment().format();
    this.mybabies = await this.fbs.get_my_babies_once();
    if (!this.mybabies || this.mybabies == null || this.mybabies.length == 0
             || (this.mybabies.length > 1 && (this.id == null || !this.id) )) {
      this.navCtrl.setRoot(ProfilesPage);
      return;
    }
    this.babySelector = await this.create_baby_selector(this.mybabies, this.id);
    await this.set_baby(this.id);
  }

  refresh() {
  }

  async changeBaby() {
    this.babySelector.present();
  }

  async create_baby_selector(babies: MyBaby[], id?: string): Promise<Alert> {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Baby');
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: async data => { this.set_baby(data); this.babySelector = await this.create_baby_selector(this.mybabies);  }
    });
    Enumerable.from(babies).select(async b => {
      let babies: Baby[] = await this.fbs.get_baby_once(b.babyid);
      if (!Enumerable.from(babies).any()) { return; }
      let baby: Baby = Enumerable.from(babies).first();
      alert.addInput({
        type: 'radio', label: baby.name, value: b.babyid, checked: (id != null && id == b.babyid) ? true : b.default
      })
    }).toArray();
    return alert;
  }

  getTitle(baby) {
    if (!baby || baby == null) { return ''; }
    if (baby.name.length > 15) { return baby.name.substring(0, 12) + '...'; }
    else { baby.name }
  }

  mybabies: MyBaby[]; // TODO: Move to singleton

  async set_baby(id?: string) {
    this.set_default_id(id);
    let babies: Baby[] = await this.fbs.get_baby_once(this.id);
    if (Enumerable.from(babies).any()) {
      this.baby = Enumerable.from(babies).first();
      this.babyname = this.baby.name;
      this.babyImg = this.baby.imgUrl;
    }
    await this.resetLists();
  }

  private set_default_id(id?: string) {
    if (Enumerable.from(this.mybabies).any(b => b.default)) {
      this.id = Enumerable.from(this.mybabies).first(b => b.default).babyid;
    }
    else if (Enumerable.from(this.mybabies).count() == 1) {
      this.id = Enumerable.from(this.mybabies).first().babyid;
    }
    if (Enumerable.from(this.mybabies).any(b => b.babyid == id)) {
      this.id = Enumerable.from(this.mybabies).first(b => b.babyid == id).babyid;
    }
  }

  async resetLists() {
    //let yest = this.getDate(moment(this.pageDate).subtract(1, 'd').format());
    //this.log = this.fbs.get_log(this.id);
    //this.yestlog = await this.fbs.get_log_once(this.id, yest);
  }

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

  showFeedingDialog() {
    let feedingModal = this.modal.create(FeedingPage, { id: this.id });
    feedingModal.onDidDismiss((data) => this.refresh());
    feedingModal.present();
  }

  showPumpingDialog() {
    let pumpingModal = this.modal.create(PumpingPage, { id: this.id });
    pumpingModal.onDidDismiss((data) => this.refresh());
    pumpingModal.present();
  }

  showDiaperDialog() {
    let diaperModal = this.modal.create(DiaperPage, { id: this.id });
    diaperModal.onDidDismiss((data) => this.refresh());
    diaperModal.present();
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
