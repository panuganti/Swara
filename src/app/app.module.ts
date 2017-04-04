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
import {BabyHeaderComponent} from '../components/baby-header/baby-header';
import { DateSelectorComponent } from '../components/date-selector/date-selector';
import { EventSelectorComponent } from '../components/event-selector/event-selector';

import {AngularFireModule} from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { SocialSharing} from '@ionic-native/social-sharing';
import {enableProdMode} from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications'
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
    BabyHeaderComponent,
    DateSelectorComponent,
    EventSelectorComponent
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
    BabyHeaderComponent,
    LoginPage,
    AddBabyComponent,
    DateSelectorComponent,
    EventSelectorComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
