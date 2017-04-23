import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

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
import { DateSelectorComponent } from '../components/date-selector/date-selector';
import { EventSelectorComponent } from '../components/event-selector/event-selector';
import { CodePushComponent } from '../components/code-push/code-push';
import { PumpingComponent } from '../components/pumping/pumping';
import { FeedingSummaryComponent } from '../components/feeding-summary/feeding-summary';

import {AngularFireModule} from 'angularfire2';
// Import Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { SocialSharing} from '@ionic-native/social-sharing';
import { CodePush } from '@ionic-native/code-push';
import { LocalNotifications} from '@ionic-native/local-notifications'

import { Utils } from '../library/utils';

enableProdMode();

declare var Date;

export const firebaseConfig = {
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
    AddBabyComponent,
    DateSelectorComponent,
    EventSelectorComponent,
    CodePushComponent,
    PumpingComponent,
    FeedingSummaryComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
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
    AddBabyComponent,
    DateSelectorComponent,
    EventSelectorComponent,
    CodePushComponent,
    PumpingComponent,
    FeedingSummaryComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    LocalNotifications,
    CodePush,
    Utils,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
