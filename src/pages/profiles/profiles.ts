import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as Enumerable from 'linq';
import { Baby } from '../../library/entities';
import * as firebase from 'firebase';

@Component({
  selector: 'page-profiles',
  templateUrl: 'profiles.html'
})
export class ProfilesPage {
  name: string = "";
  dob: string = "";
  gender: string = "";
  momsname: string = "";
  imgUrl: string = "";

  mybabies: FirebaseListObservable<any>;
  babies: FirebaseListObservable<any>;
  showAddDialog: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire) { }

  getId(babies: any[]): string {
    var num = this.getCount(babies) + 1;;
    return '' + num;
  }

  ionViewDidLoad() {
    let user = firebase.auth().currentUser;
    this.mybabies = this.af.database.list('/Babies' + '_' + this.sanitizeEmail(user.email));
    this.babies = this.af.database.list('/Babies');
  }

  deleteBaby(key, ev) {
    console.log('deleting' + ev);
    console.log(key);
    this.babies.remove(ev).then(() => console.log('deleted'));
    if (key == '' || key == null) { console.log('wrong key'); return;}
    this.mybabies.remove(key).then(() => console.log('deleted from my babies')); // TODO: Also remove from shared..but, where is it stored ? 
  }

  share(ev: any) {
    console.log('sharing with ' + ev.email + ' by ' + ev.id);
  }

  logoutClicked() {
    this.af.auth.logout();
  }

  showBaby(id: string) {
    this.navCtrl.push(HomePage, { id: id });
  }

  newBaby() {
    this.showAddDialog = true;
    console.log(this.showAddDialog);
  }

  // TODO: Share

  addBaby(ev: any) {
    console.log('in add');
    var baby: Baby = {
      name: ev.name,
      dob: ev.dob,
      gender: ev.gender,
      momsname: ev.momsname,
      imgUrl: ev.imgUrl
    }
    let babyRef = this.babies.push(baby);
    var id = this.mybabies.push({
      babyid: babyRef.key,
      admintype: 'creator'
    });
    this.showAddDialog = false;
    this.showBaby(id.key);
  }

  sanitizeEmail(email: string): string {
    email = email.trim();
    email = email.replace(/\./g, "_");
    email = email.replace(/\$/g, "_");
    email = email.replace(/\[/g, "_");
    email = email.replace(/\]/g, "_");
    email = email.replace(/#/g, "_");
    email = email.replace(/\//g, "_");
    return email;
  }

  getCount(babies: Baby[]): number {
    if (babies == null || !Enumerable.from(babies).any()) {
      return 0;
    }
    return Enumerable.from(babies).count();
  }

  getStarted() {
    window.localStorage.setItem("name", this.name);
    console.log(Date.parse(this.dob));
    window.localStorage.setItem("dob", this.dob);
    this.navCtrl.push(HomePage);
  }

}
