import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {
  name: string = "";
  dob: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  getStarted() {
    window.localStorage.setItem("name", this.name);
    console.log(Date.parse(this.dob));
    window.localStorage.setItem("dob", this.dob);
    this.navCtrl.push(HomePage);
  }

}
