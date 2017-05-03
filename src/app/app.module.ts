import { NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';

// Import All Pages
import { HomePage } from '../pages/home/home';
import {ProfilesPage} from '../pages/profiles/profiles';
import {LoginPage} from '../pages/login/login';
import { FriendsPage } from '../pages/friends/friends';

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
};

const pages: any[] = [
    MyApp,
    HomePage,
    ProfilesPage,
    LoginPage,
    FriendsPage
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
    MomentModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers:  AppProviders.getProviders()
})
export class AppModule {}
