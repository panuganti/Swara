import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ProfilesPage } from '../pages/profiles/profiles';
import { FriendsPage } from '../pages/friends/friends';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { SettingsPage } from '../pages/settings/settings';

import { Utils } from '../library/utils';
import { FirebaseService } from '../providers/firebase-service';
import { User } from '../library/fb-entities';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  profileImg: string;
  name: string;

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
    },
    {
      title: 'My Profile',
      icon: 'ios-person-outline',
      count: 0,
      component: MyProfilePage
    },
    {
      title: 'Settings',
      icon: 'ios-settings-outline',
      count: 0,
      component: SettingsPage
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

  goToMyProfilePage() {
    console.log('going to my profile page');
    this.rootPage = MyProfilePage;
  }

  // Only for testing
  async reset() {
    await this.fbs.logout(); // TODO: remove later
    window.localStorage.removeItem('phone');
    window.localStorage.removeItem('secret');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('email_from_phone');
    window.localStorage.removeItem('user');
  }

  async set_root() {
    //await this.reset();
    var is_logged_in = this.fbs.is_logged_in();
    if (is_logged_in) { await this.routeToHomeOrProfilesPage(); }
    if (!is_logged_in) {
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
      }
    }
  }

  async routeToHomeOrProfilesPage() {
    var phone = window.localStorage.getItem('phone');
    let user: User[] = await this.fbs.get_users_once(phone);
    if (user && user.length > 0 && user[0].displayName) {
      this.name = user[0].displayName;
    }
    else {
      let email = window.localStorage.getItem('email');
      this.name = email;
    }

    if (user && user.length > 0 && user[0].picture) {
      this.profileImg = user[0].picture;
    }

    var mybabies = await this.fbs.get_my_babies_once();
    if (mybabies != null && mybabies.length > 0) {
      this.rootPage = HomePage;
      return;
    }
    this.rootPage = ProfilesPage;
  }

  openPage(page) {
    this.rootPage = page.component;
  }
}
