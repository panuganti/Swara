import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Import All Pages
import { HomePage } from '../pages/home/home';
import {ProfilesPage} from '../pages/profiles/profiles';
import {LoginPage} from '../pages/login/login';

// Import All Components
import {BabyComponent} from '../components/baby/baby';
import {TimeDateVolComponent} from '../components/time-date-vol/time-date-vol';
import {TimeDateComponent} from '../components/time-date/time-date';
import {DiaperComponent} from '../components/diaper/diaper';
import { AddBabyComponent } from '../components/addbaby/addbaby';

import {AngularFireModule} from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { SocialSharing} from '@ionic-native/social-sharing';
import {enableProdMode} from '@angular/core';
enableProdMode();

declare var Date;

export const firebaseConfig = {
    apiKey: "AIzaSyChiLvTId7LOh97E1Zq_Ih8BzSKxdcu_uI",
    authDomain: "panuganti-swara.firebaseapp.com",
    databaseURL: "https://panuganti-swara.firebaseio.com",
    storageBucket: "panuganti-swara.appspot.com",
    messagingSenderId: "506431501481"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilesPage,
    TimeDateVolComponent,
    TimeDateComponent,
    DiaperComponent,
    BabyComponent,
    LoginPage,
    AddBabyComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilesPage,
    TimeDateVolComponent,
    TimeDateComponent,
    DiaperComponent,
    BabyComponent,
    LoginPage,
    AddBabyComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
