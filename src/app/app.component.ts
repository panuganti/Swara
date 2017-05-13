import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfilesPage } from '../pages/profiles/profiles';
import { FriendsPage } from '../pages/friends/friends';
import { Utils } from '../library/utils';
//import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';
//import * as firebase from 'firebase'
import { FirebaseService } from '../providers/firebase-service';

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
      component: FriendsPage // TODO:
    }
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public fbs: FirebaseService,
    backgroundmode: BackgroundMode, public utils: Utils, public modal: ModalController) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
        backgroundmode.enable();
        backgroundmode.configure({ title: '', text: '', ticker: '' })
      }
      this.set_root();
    });
  }

  // Only for testing
  async reset() {
    await this.fbs.logout(); // TODO: remove later
    window.localStorage.removeItem('phone');
    window.localStorage.removeItem('secret');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('email_from_phone');
  }

  async set_root() {
    //await this.reset();
    var user = this.fbs.get_user();
    if (user) { await this.routeToHomeOrProfilesPage(); }
    if (!user) {
      var phone = window.localStorage.getItem('phone');
      var secret = window.localStorage.getItem('secret');
      var email_from_phone = window.localStorage.getItem('email_from_phone');
      if (phone && secret && email_from_phone) {
        try {
          await this.fbs.login(email_from_phone, phone, secret);
          await this.routeToHomeOrProfilesPage();
        }
        catch (err) {
          // TODO:
          console.log(err);
        }
      }
      else {
        let login_modal = this.modal.create(LoginPage);
        login_modal.onDidDismiss(async (data) => {
          await this.routeToHomeOrProfilesPage();          
        });
        login_modal.present();
        //this.rootPage = LoginPage;
      }
    }
  }

  async routeToHomeOrProfilesPage() {
    var mybabies = await this.fbs.get_my_babies_once();
    if (mybabies != null) {
      this.rootPage = ProfilesPage;//HomePage
      return;
    }
    this.rootPage = ProfilesPage;
  }

  openPage(page) {
    this.rootPage = page.component;
  }
}
