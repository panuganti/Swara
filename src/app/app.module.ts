import { NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

// Import All Pages
import { HomePage } from '../pages/home/home';
import {ProfilesPage} from '../pages/profiles/profiles';
import {LoginPage} from '../pages/login/login';
import { PhoneVerificationPage } from '../pages/phone-verification/phone-verification';

// Import All Components
import {BabyComponent} from '../components/baby/baby';
import {TimeDateVolComponent} from '../components/time-date-vol/time-date-vol';
import {TimeDateComponent} from '../components/time-date/time-date';
import {DiaperComponent} from '../components/diaper/diaper';
import { AddBabyComponent } from '../components/addbaby/addbaby';
import { DateSelectorComponent } from '../components/date-selector/date-selector';
import { EventSelectorComponent } from '../components/event-selector/event-selector';
import { CodePushComponent } from '../components/code-push/code-push';

import {AngularFireModule} from 'angularfire2';

import { AppProviders } from './app.providers';

enableProdMode();

declare var Date;

export const firebaseConfig = {
    apiKey: "AIzaSyChiLvTId7LOh97E1Zq_Ih8BzSKxdcu_uI",
    authDomain: "panuganti-swara.firebaseapp.com",
    databaseURL: "https://panuganti-swara.firebaseio.com",
    projectId: "panuganti-swara",
    storageBucket: "panuganti-swara.appspot.com",
    messagingSenderId: "506431501481"  
};

const pages: any[] = [
    MyApp,
    HomePage,
    ProfilesPage,
    LoginPage,
    PhoneVerificationPage
]

const components: any[] = [
    TimeDateVolComponent,
    TimeDateComponent,
    DiaperComponent,
    BabyComponent,
    AddBabyComponent,
    DateSelectorComponent,
    EventSelectorComponent,
    CodePushComponent  
];

@NgModule({
  declarations: components.concat(pages),
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers:  AppProviders.getProviders()
})
export class AppModule {}
