import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as Enumerable from 'linq';
import { FirebaseListObservable } from 'angularfire2';
import { Baby } from '../../library/entities';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FirebaseService } from '../../providers/firebase-service';

@Component({
  selector: 'page-profiles',
  templateUrl: 'profiles.html'
})
export class ProfilesPage {
  forceAddDialog: boolean = false;
  baby_count: number = 0;
  my_babies: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fbs: FirebaseService, public social: SocialSharing, public loading: LoadingController) { }

  ionViewDidLoad() {
    this.get_init_count();
  }

  added() {
    this.forceAddDialog = false;
    this.get_init_count();
  }

  async refresh_babies() {
    return  await this.fbs.get_my_babies_once();
  }

  async get_init_count() {
    var my_babies = await this.refresh_babies();
    this.baby_count = Enumerable.from(my_babies).count();
    if (this.baby_count > 0) {
      this.my_babies = this.fbs.get_my_babies_obs();
    }
  }

  async deleteBaby(key) {
    await this.refresh_babies();
  }

  showBaby(id: string) {
    this.navCtrl.setRoot(HomePage, { id: id });
  }

  newBaby() {
    this.forceAddDialog = true;
  }

  share(ev: any) {
    /*
    load contacts modal
    select contact
    click share/cancel
    refresh();
    */
  }

  addBaby(ev: any) {
    this.refresh_babies();
  }

}
