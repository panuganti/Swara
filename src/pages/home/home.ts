import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { TimeVolType, TimeVol, Diaper } from '../../library/entities';
import * as Enumerable from 'linq';
import * as moment from 'moment';
import { ProfilesPage } from '../profiles/profiles';
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
    this.baby = this.af.database.object('/Babies/' + this.babyid);
    this.pageDate = moment().format();
    this.resetLists();
  }

  resetLists() {
    console.log('/Feeding_' + this.babyid);
    var query = { orderByChild: "date", equalTo: this.getDate(this.pageDate) };
    var yestquery = { orderByChild: "date", equalTo: this.getDate(moment(this.pageDate).subtract(1, 'd').format()) };
    this.feeding = this.af.database.list('/Feeding_' + this.babyid, { query: query });
    this.pumping = this.af.database.list('/Pumping_' + this.babyid, { query: query });
    this.diaper = this.af.database.list('/Diaper_' + this.babyid, { query: query });
    this.yestfeeding = this.af.database.list('/Feeding_' + this.babyid, { query: yestquery });
    this.yestpumping = this.af.database.list('/Pumping_' + this.babyid, { query: yestquery });
    this.yestdiaper = this.af.database.list('/Diaper_' + this.babyid, { query: yestquery });
  }

  logoutClicked() {
    this.af.auth.logout();
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
    console.log(d);
    var m = moment(d);
    var datestring = '' + m.year() + m.month() + m.day();
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
      return lastelement.type;
    }
    return 'Random';
  }

  showNoFeedingText: boolean = false;
  getLastFeedTime(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if (feeding == null || (Enumerable.from(feeding).count() == 0)) {
      if (yestfeeding == null || (Enumerable.from(yestfeeding).count() == 0)) {
        //this.showNoFeedingText = true;
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

  showNoDiaperText: boolean = true;
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

  getCount(feeding: TimeVolType[], yestfeeding: TimeVolType[]): number {
    return Enumerable.from(feeding).count();
  }

  getVolume(feeding: TimeVolType[], yestfeeding: TimeVolType[]): number {
    return Enumerable.from(feeding).sum(f => f.volume);
  }

  // #endregion Summary

  //#region variables
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
