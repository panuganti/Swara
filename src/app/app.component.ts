import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfilesPage } from '../pages/profiles/profiles';
import { Utils } from '../library/utils';
import { AngularFire,  AuthMethods, AuthProviders } from 'angularfire2';
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
      title: 'Friends',
      icon: 'ios-people-outline',
      count: 0,
      component: ProfilesPage // TODO:
    }
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public af: AngularFire,
     backgroundmode: BackgroundMode, public utils: Utils) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.set_root();
      backgroundmode.enable();      
      backgroundmode.configure({ title: 'You have no new notifications', text: '', ticker: '' })
    });
  }

  async set_root() {
    var user = firebase.auth().currentUser;
    if (user) { await this.routeToHomeOrProfilesPage();}
    if (!user) {
      var phone = window.localStorage.getItem('phone');
      var secret = window.localStorage.getItem('secret');
      if (phone && secret) {
        try {
          await this.af.auth.login({email: 'User' + phone.toString() + '@trackbabyvitals.com', password: secret },
                           { provider: AuthProviders.Password, method: AuthMethods.Password });
          await this.routeToHomeOrProfilesPage();
        }
        catch(err) {
          // TODO:
          console.log(err);
        }
      }
      else {
        this.rootPage = LoginPage;
      }
    }
  }

  async routeToHomeOrProfilesPage() {
    var phone = window.localStorage.getItem('phone');    
    var mybabies = await this.af.database.list('/Babies' + '_' + phone);
    mybabies.subscribe((babies: any[]) => {
        if (!babies || babies.length == 0) { this.rootPage = ProfilesPage; return; }
        this.rootPage = HomePage;
      });
  }

  openPage(page) {
    this.rootPage = page.component;
  }
}
