import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import {TimeVolType, DiaperType,  FeedingType} from '../../library/entities';

import * as Enumerable from 'linq';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public af: AngularFire) {
    var query = {orderByChild: "date", equalTo: this.getDate()};
    this.feeding = af.database.list('/Feeding', {query: query});
    this.pumping = af.database.list('/Pumping', {query});
    this.diaper = af.database.list('/Diaper', {query});
  }

  getDate(): string {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return '' + year + month + day;
  }

  //#region Feeding
  addPumpedFeeding() {
    this.feedingtime = new Date().toTimeString();
    this.showPumpedFeeding = true;
    this.showFab = false;
  }
  addFormulaFeeding() {
    this.showFormulaFeeding = true;
    this.showFab = false;
  }
  addBreastFeeding() {
    this.showFab = false;
  }
  //#endregion Feeding

  addDiaper(type: string) {
    this.showDiaper = true;
    this.showPumping = true;
  }

  saveDiaper() {
    this.diaper.push({
      type: this.diaperType,
      date: this.getDate(),
      time: this.time
    });
  }

  savePumped() {
    this.pumping.push({
      time: this.time,
      date: this.getDate(),
      volume: this.volume
    });
  }

  saveFed() {
    var date = this.date;
    var time = this.feedingtime;
    var type = 'pumped';
    if (this.showBreastfeeding) {
      type = 'breastfed';
    }
    if (this.showFormulaFeeding) {
      type = 'formula';
    }
    this.feeding.push({
      time: time,
      date: date,
      volume: this.volume,
      type: type
    });
    this.resetFeeding();
  }

  resetFeeding() {
    this.showPumpedFeeding = false;
    this.showFormulaFeeding = false;
    this.showBreastfeeding = false;

    this.volume = 60;
    this.date = new Date();
    this.time = new Date();
  }

  getName(): string {
    return window.localStorage.getItem("name");
  }

  getAge() : number {
    var dob: string = window.localStorage.getItem("dob");
    console.log(dob);
    var ageInDays = Math.floor((Date.now() - Date.parse(dob))/(1000*60*60*24));
    return ageInDays;
  }

  getLastFeedType(feeding): string {
    return 'Pumped';
  }

  getLastFeedTime(feeding): string {
    return '2 hrs 20 mins';
  }

  getLastPumpedTime(pumped): string {
    return '1 hrs 20 mins';
  }

  getDiaperType(diaper) : string {
    return 'Wet';
  }

getPreviousDiaperTime(diaper) {
  return '1 hr 40 mins';
}  

  showDailyActivity() { }

  getCount(feeding: any[]) : number {
    return Enumerable.from(feeding).count();
  }

  getVolume(feeding: TimeVolType[]) : number {
    return Enumerable.from(feeding).sum(f => f.volume);
  }

  getFeedingSummary(feeding: TimeVolType []) : string {
    if (feeding == null) { return '';}
    var totalMins = Math.floor((Enumerable.from(feeding).max(f => Date.now() - f.time))/(1000*60));
    var hrs = Math.floor(totalMins/60); var mins = Math.floor(totalMins - hrs*60); 
    return '' + hrs + 'hrs and ' + mins +  'mins ago';
 
  }

  getDiaperSummary(feeding: TimeVolType []) {
    if (feeding == null) { return '';}
    var out = Math.floor(Enumerable.from(feeding).max(f => Date.now() - f.time)/(1000*60));
    var hrs = Math.floor(out/60); var mins = Math.floor(out - hrs*60);
    return '' + hrs + 'hrs and ' + mins + 'mins ago';
  }

//#region variables
  feeding: FirebaseListObservable<any>;
  pumping: FirebaseListObservable<any>;
  diaper: FirebaseListObservable<any>;

  diaperType: DiaperType;
  time: Date;
  date: Date;
  volume: number;
  feedingType: FeedingType;

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

}
