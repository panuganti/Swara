import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { TimeVolType, TimeVol, Diaper } from '../../library/entities';
import * as Enumerable from 'linq';
import * as moment from 'moment';
//import { LocalNotifications } from '@ionic-native/';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /* Page Params */
  pageDate: string;
  babyid: string;
  /* Page Params */

  /* Feeding */
  showFeeding: boolean = false;
  feedingType: string = '';
  /* Feeding */


  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
  }

  ionViewDidLoad() {
    var id = this.navParams.get("id");
    this.babyid = id;
    console.log('id:' + id);
    this.pageDate = moment().format();
    console.log(moment(this.pageDate).valueOf())
    this.resetLists();
  }

  resetLists() {
    var query = { orderByChild: "date", equalTo: this.getDate(this.pageDate) };
    var yestquery = { orderByChild: "date", equalTo: this.getDate(moment(this.pageDate).subtract(1, 'd').format()) };
    this.feeding = this.af.database.list('/Feeding_' + this.babyid, { query: query });
    this.pumping = this.af.database.list('/Pumping_' + this.babyid, { query: query });
    this.diaper = this.af.database.list('/Diaper_' + this.babyid, { query: query });
    this.yestfeeding =  this.af.database.list('/Feeding_' + this.babyid, { query: yestquery });
    this.pumping = this.af.database.list('/Pumping_' + this.babyid, { query: yestquery });
    this.diaper = this.af.database.list('/Diaper_' + this.babyid, { query: yestquery });
  }

  /* Date selector */
  prevDate() {
    if (!this.showNextDate) {
      this.showNextDate = true;
    }
    this.pageDate = moment(this.pageDate).subtract(1, 'd').format();
    this.resetLists();
  }

  showNextDate: boolean = false;
  nextDate() {
    var pageMoment = moment(this.pageDate);
    var todayMoment = moment();
    var diff = Math.ceil(moment.duration(pageMoment.diff(todayMoment)).asDays());
    if (diff >= -1) {
      this.showNextDate = false;
    }
    this.pageDate = moment(this.pageDate).add(1, 'd').format();
    this.resetLists();
  }
  /* Date selector */


  getDate(d: string): string {
    var m = moment(d);
    var datestring = '' + m.year() + m.month() + m.day();
    console.log(datestring);
    return datestring;
  }

  //#region Feeding
  showFeedingDialog() {
    this.showFeeding = true;
    this.showPumping = false;
    this.showDiaper = false;
  }

  showPumpingDialog() {
    this.showFeeding = false;
    this.showPumping = true;
    this.showDiaper = false;
  }

  showDiaperDialog() {
    this.showFeeding = false;
    this.showPumping = false;
    this.showDiaper = true;
  }

  saveFeeding(ev: TimeVol, type: string) {
    var item = {
      time: ev.time,
      date: this.getDate(ev.date),
      volume: ev.volume,
      type: type
    };
    console.log(item);
    this.feeding.push(item);
    this.showFeeding = false;
  }

  saveDiaper(ev: Diaper) {
    this.diaper.push({
      type: ev.type,
      date: this.getDate(ev.date),
      time: ev.time
    });
    this.showDiaper = false;
  }

  savePumping(ev: TimeVol) {
    this.pumping.push({
      time: ev.time,
      date: this.getDate(ev.date),
      volume: ev.volume
    });
    this.showPumping = false;
  }

  //#endregion Feeding

  getName(): string {
    return window.localStorage.getItem("name");
  }

  getAge(): number {
    var dob: string = window.localStorage.getItem("dob");
    var now = moment(Date.now());
    var dobMoment = moment(dob);
    var duration = moment.duration(now.diff(dobMoment));
    var ageInDays = Math.floor(duration.asDays());
    return ageInDays;
  }

  // #region Summary
  getLastFeedType(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if ((feeding != null) && (Enumerable.from(feeding).count() > 0)) {
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      return lastelement.type;
    }
    return 'Random';
  }

  getLastFeedTime(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if ((feeding != null) && (Enumerable.from(feeding).count() > 0)) {
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      return lastelement.time;
    }
  }

  getLastPumpedTime(pumping: TimeVolType[], yestpumping: TimeVolType[]): string {
    return '1 hrs 20 mins';
  }

  getDiaperType(diaper: Diaper[], yestdiaper: Diaper[]): string {
    return 'Wet';
  }

  getPreviousDiaperTime(diaper: Diaper[], yestdiaper: Diaper[]) {
    return '1 hr 40 mins';
  }

  getCount(feeding: TimeVolType[], yestfeeding: TimeVolType[]): number {
    return Enumerable.from(feeding).count();
  }

  getVolume(feeding: TimeVolType[], yestfeeding: TimeVolType[]): number {
    return Enumerable.from(feeding).sum(f => f.volume);
  }

  getFeedingSummary(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if (feeding == null) { return ''; }
    //    var totalMins = Math.floor((Enumerable.from(feeding).max(f => Date.now() - f.time)) / (1000 * 60));
    //    var hrs = Math.floor(totalMins / 60); var mins = Math.floor(totalMins - hrs * 60);
    return '' + 'hrs and ' + 'mins ago';

  }

  getDiaperSummary(diaper: Diaper[], yestdiaper: Diaper[]) {
    if (diaper == null) { return ''; }
    //    var out = Math.floor(Enumerable.from(feeding).max(f => Date.now() - new Date(f.time)) / (1000 * 60));
    //  var hrs = Math.floor(out / 60); var mins = Math.floor(out - hrs * 60);
    return '' + 'hrs and ' + 'mins ago';
  }
  // #endregion Summary

  //#region variables
  feeding: FirebaseListObservable<any>;
  pumping: FirebaseListObservable<any>;
  diaper: FirebaseListObservable<any>;
  yestfeeding: FirebaseListObservable<any>;
  yestpumping: FirebaseListObservable<any>;
  yestdiaper: FirebaseListObservable<any>;

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
  //#endregion variables

  /*
  // Schedule delayed notification 
  scheduleAlarm() {
  LocalNotifications.schedule({
     text: 'Alarm has expired!',
     at: new Date(new Date().getTime() + 3600),
     sound: isAndroid ? 'file://sound.mp3': 'file://beep.caf',
     data: { message : 'json containing app-specific information to be posted when alarm triggers' }
  });
  }
  */


}
