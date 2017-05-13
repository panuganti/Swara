import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable, AuthMethods, AuthProviders, FirebaseAuthState } from 'angularfire2';

@Injectable()
export class FirebaseService {
  //#region Private
  auth_state: firebase.Promise<FirebaseAuthState>;
  mybabies: FirebaseListObservable<any>;
  babies: FirebaseListObservable<any>;

  private set_babies() {
    this.babies = this.af.database.list('/Babies');
  }

  private set_my_babies() {
    let phone = window.localStorage.getItem('phone');
    this.mybabies = this.af.database.list('/Babies' + '_' + phone);
  }
  //#endregion Private

  constructor(public af: AngularFire) {
  }

  logout() {
    this.af.auth.logout();
  }

  get_user() {
    return firebase.auth().currentUser;
  }

  async login(email, phone, passwd): Promise<FirebaseAuthState> {
    this.auth_state = this.af.auth.login({ email: email, password: passwd },
      { provider: AuthProviders.Password, method: AuthMethods.Password });
    await this.auth_state;
    this.babies = this.af.database.list('/Babies');
    return this.auth_state;
  }

  async create_user(email: string, password: string) {
      await this.af.auth.createUser({ email: email, password: password });
  }

  get_log(key): FirebaseListObservable<any> {
    return this.af.database.list('/Log_' + key);
  }

  get_baby_obs(key: string) {
    return this.af.database.list('/Babies/' + key);
  }

  async delete_baby(key) {
    await this.get_babies_obs().remove();
  }

  async delete_baby_from_my_babies(key) {
    let my_baby = (await this.get_my_babies_obs().$ref.orderByChild('babyid').equalTo(key).once('value')).val();
    await my_baby.remove();
  }

  async get_baby_once(key: string) {
    return (await this.get_baby_obs(key).$ref.once('value')).val();
  }

  async get_my_babies_once() {
    if (!this.mybabies) { this.set_my_babies(); }
    return (await this.mybabies.$ref.once('value')).val();
  }

  get_my_babies_obs(): FirebaseListObservable<any> {
    if (!this.mybabies) { this.set_my_babies() }
    return this.mybabies;
  }

  get_babies_obs(): FirebaseListObservable<any> {
    if (!this.babies) { this.set_babies() }
    return this.babies;
  }

  async delete_log(key) {
    await this.get_log(key).remove();
  }

  get_storage_ref() {
    return firebase.storage().ref();
  }

  get_users() {
    return this.af.database.list('/Users');
  }

  async get_users_once(phone?:string) {
    if (phone && phone != null) {
      return (await this.get_users().$ref.orderByChild('phone').equalTo(phone).once('value')).val();
    }
    return (await this.get_users().$ref.once('value')).val();
  }

}
