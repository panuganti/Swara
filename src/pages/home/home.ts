import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { TimeVolType, TimeVol, Diaper } from '../../library/entities';
import * as Enumerable from 'linq';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { ProfilesPage } from '../profiles/profiles';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LoginPage } from '../login/login';
import { Utils } from '../../library/utils';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mybabies: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire, public localNotifications: LocalNotifications, public utils: Utils) {
  }

  ionViewDidLoad() {
    // Get all mybabies and choose the default one if not specified.
    var id = this.navParams.get("id");
    if (id != null) {
      this.babyid = id;
      this.baby = this.af.database.object('/Babies/' + this.babyid);
    }
    else {
      this.get_default();
    }
    this.pageDate = moment().format();
    this.resetLists();
  }

  get_default(): string {
    let user = firebase.auth().currentUser;
    this.mybabies = this.af.database.list('/Babies' + '_' + this.utils.sanitize_email(user.email));
    this.mybabies.subscribe((babies: any) => {
      if (!babies) { return; }
      for (var baby of babies) {
        if (baby.default) {
          this.babyid = baby.babyid; this.baby = this.af.database.object('/Babies/' + this.babyid);
          break;
        }
      }
    })
    return;
  }





  resetLists() {
    var query = { orderByChild: "date", equalTo: this.getDate(this.pageDate) };
    var yestquery = { orderByChild: "date", equalTo: this.getDate(moment(this.pageDate).subtract(1, 'd').format()) };
    this.feeding = this.af.database.list('/Feeding_' + this.babyid, { query: query });
    this.pumping = this.af.database.list('/Pumping_' + this.babyid, { query: query });
    this.diaper = this.af.database.list('/Diaper_' + this.babyid, { query: query });
    this.yestfeeding = this.af.database.list('/Feeding_' + this.babyid, { query: yestquery });
    this.yestpumping = this.af.database.list('/Pumping_' + this.babyid, { query: yestquery });
    this.yestdiaper = this.af.database.list('/Diaper_' + this.babyid, { query: yestquery });
  }

  getTitle(baby) {
    return this.getName(baby) + ' (' + this.getAge(baby) + ' days old)';
  }

  logoutClicked() {
    this.af.auth.logout();
    this.navCtrl.setRoot(LoginPage);
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

  //#region Feeding
  showFeedingDialog() {
    this.showFeeding = true;
    this.showPumping = false;
    this.showDiaper = false;
    // set defaults
    this.feedingDate = this.pageDate;
    this.feedingVolume = 0;
    this.editType = false;
  }

  pumpingDate: string;
  pumpingVolume: number;
  showPumpingDialog() {
    this.showFeeding = false;
    this.showPumping = true;
    this.showDiaper = false;
    // set defaults
    this.pumpingDate = this.pageDate;
    this.pumpingVolume = 0;
    this.editType = false;
  }

  diaperDate: string;
  diaperType: string;
  showDiaperDialog() {
    this.showFeeding = false;
    this.showPumping = false;
    this.showDiaper = true;
    // set defaults
    this.diaperDate = this.pageDate;
    this.diaperType = 'both';
    this.editType = false;
  }

  feedingDate: string;
  feedingVolume: number;
  editType: boolean = false;
  key: string;
  editFeeding(feed) {
    this.feedingDate = feed.date;
    this.feedingVolume = feed.volume;
    this.editType = true;
    this.key = feed.$key;
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

  editDiapering(diaper) {
    this.diaperDate = diaper.date;
    this.diaperType = diaper.type;
    this.editType = true;
    this.key = diaper.$key;
  }

  editPumping(pump: any) {
    this.pumpingDate = pump.date;
    this.pumpingVolume = pump.volume;
    this.editType = true;
    this.key = pump.$key;
  }


  saveFeeding(ev: TimeVol, type: string, edit: boolean, key: string) {
    var item = {
      time: ev.time,
      date: this.getDate(ev.date),
      volume: ev.volume,
      type: type
    };
    if (edit) {
      // update
      this.feeding.update("", item);
    }
    else {
      this.feeding.push(item);
    }
    this.showFeeding = false;
  }

  saveDiaper(ev: Diaper, edit: boolean, key: string) {
    var item = {
      type: ev.type,
      date: this.getDate(ev.date),
      time: ev.time
    }
    if (edit) {
      this.diaper.update(key, item);
    }
    else {
      this.diaper.push(item);
    }
    this.showDiaper = false;
  }

  savePumping(ev: TimeVol, edit: boolean, key: string) {
    var item = {
      time: ev.time,
      date: this.getDate(ev.date),
      volume: ev.volume
    };
    if (edit) {
      this.pumping.update(key, item);
    }
    else {
      this.pumping.push(item);
    }
    this.showPumping = false;
  }

  //#endregion Feeding

  getName(baby: any): string {
    if (baby == null) { return ''; }
    return baby.name;
  }

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

  toggleFeeding() {
    this.expandFeedingList = !this.expandFeedingList;
  }
  togglePumping() {
    this.expandPumpingList = !this.expandPumpingList;
  }
  toggleDiapering() {
    this.expandDiaperList = !this.expandDiaperList;
  }

  getUnits(feed: any): string {
    if (feed.type == 'breastfeeding') {
      return 'mins';
    }
    else {
      return 'ml';
    }
  }

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

  // #endregion Summary

  //#region variables
  expandDiaperList: boolean = false;
  expandPumpingList: boolean = false;
  expandFeedingList: boolean = false;

  showNoDiaperText: boolean = true;
  feeding: FirebaseListObservable<any>;
  pumping: FirebaseListObservable<any>;
  diaper: FirebaseListObservable<any>;
  yestfeeding: FirebaseListObservable<any>;
  yestpumping: FirebaseListObservable<any>;
  yestdiaper: FirebaseListObservable<any>;
  baby: FirebaseObjectObservable<any>;

  feedingTitle: string;
  feedingText: string;
  diaperTitle: string;
  diaperText: string;
  pumpingTitle: string;
  pumpingText: string;

  showFab: boolean = true;
  showDiaper: boolean = false;
  showPumping: boolean = false;
  showPumpedFeeding: boolean = false;
  showFormulaFeeding: boolean = false;
  showBreastfeeding: boolean = false;

  feedingtime: string;
  pageDate: string;
  babyid: string;
  showFeeding: boolean = false;
  feedingType: string = '';
  //#endregion variables

}
