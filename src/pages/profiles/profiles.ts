import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as Enumerable from 'linq';
import { FirebaseListObservable } from 'angularfire2';
import { Baby } from '../../library/entities';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FirebaseService } from '../../providers/firebase-service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'page-profiles',
  templateUrl: 'profiles.html'
})
export class ProfilesPage {
  forceAddDialog: boolean = false;
  baby_count: number = 0;
  my_babies: Promise<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fbs: FirebaseService, public social: SocialSharing, public loading: LoadingController) { }

  ionViewDidLoad() {
    this.get_init_count();
  }

  async added() {
    this.forceAddDialog = false;
    await this.get_init_count();
  }

  async refresh_babies() {
    this.my_babies = this.fbs.get_my_babies_once();
  }

  async get_init_count() {
    await this.refresh_babies();
    this.baby_count = Enumerable.from(await this.my_babies).count();
  }

  async deleteBaby(key) {
    await this.get_init_count();
  }

  showBaby(id: string) {
    console.log(id);
    this.navCtrl.setRoot(HomePage, { id: id });
  }

  newBaby() {
    this.forceAddDialog = true;
  }

  share(ev: any) {
  }

  async addBaby(ev: any) {
    await this.get_init_count();
  }

}
