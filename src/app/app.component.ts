import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfilesPage } from '../pages/profiles/profiles';

import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  pages: any = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    {
      title: 'Babies',
      icon: 'ios-happy-outline',
      count: 0,
      component: ProfilesPage
    },
    {
      title: 'Logout',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public af: AngularFire) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
        firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;              }
      });
    });
  }

  ionViewDidLoad() {}

  openPage(page) {
    if(page.title == "Logout") { this.af.auth.logout();}
    this.rootPage = page.component;
  }
}
