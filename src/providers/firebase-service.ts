import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable, AuthMethods, AuthProviders, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs/Rx';
import { MyBaby, Baby, User, NursingLog, PumpingLog, DiaperLog } from '../library/entities';

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

  private _get_nursing_log(key: string): FirebaseListObservable<any> {
    return this.af.database.list('/NursingLog_' + key);
  }

  private _get_pumping_log(key: string): FirebaseListObservable<any> {
    return this.af.database.list('/PumpingLog_' + key);
  }

  private _get_diaper_log(key: string): FirebaseListObservable<any> {
    return this.af.database.list('/DiaperLog_' + key);
  }

  private _get_baby_obs(key: string): FirebaseListObservable<any[]> {
    return this.af.database.list('/Babies/' + key);
  }

  private _get_users(): FirebaseListObservable<any[]> {
    return this.af.database.list('/Users');
  }

  private _get_babies_obs(): FirebaseListObservable<any> {
    if (!this.babies) { this.set_babies() }
    return this.babies;
  }

  private get_storage_ref(): firebase.storage.Reference {
    return firebase.storage().ref();
  }

  //#endregion Private

  constructor(public af: AngularFire) {
  }

  push_my_baby(my_baby: MyBaby) {
    this._get_my_babies_obs().push(my_baby);
  }

  push_baby(baby: Baby): string {
    let ref = this._get_babies_obs().push(baby);
    return ref.key;
  }

  async push_user(user: User): Promise<void> {
     await this._get_users().push(user);
  }

  push_nursing_log(id: string, log: NursingLog) {
    this._get_nursing_log(id).push(log);
  }

  push_pumping_log(id: string, log: PumpingLog) {
    this._get_pumping_log(id).push(log);
  }

  push_diaper_log(id: string, log: DiaperLog) {
     this._get_diaper_log(id).push(log);
  }

  logout(): Promise<void> {
    return this.af.auth.logout();
  }

  get_nursing_log(key: string): Observable<any> {
    return this._get_nursing_log(key);
  }

  get_pumping_log(key: string): Observable<any> {
    return this._get_pumping_log(key);
  }

  get_diaper_log(key: string): Observable<any> {
    return this._get_diaper_log(key);
  }

  async get_nursing_log_once(key: string, date: string): Promise<any> {
    return (await this._get_nursing_log(key).$ref.orderByChild('date').equalTo(date).once('value')).val();
  }

  async get_pumping_log_once(key: string, date: string): Promise<any> {
    return (await this._get_pumping_log(key).$ref.orderByChild('date').equalTo(date).once('value')).val();
  }

  async get_diaper_log_once(key: string, date: string): Promise<any> {
    return (await this._get_diaper_log(key).$ref.orderByChild('date').equalTo(date).once('value')).val();
  }

  get_baby_obs(key: string): Observable<any> {
    return this._get_baby_obs(key);
  }

  async delete_baby(key): Promise<void> {
    return await this._get_babies_obs().remove();
  }

  async delete_baby_from_my_babies(key: string): Promise<void> {
    let my_baby = (await this._get_my_babies_obs().$ref.orderByChild('babyid').equalTo(key).once('value')).val();
    await my_baby.remove();
  }

  async update_user(phone: string, user) {
    let user_once = await this._get_users().$ref.orderByChild('phone').equalTo(phone).once('value');
    debugger;
    await this._get_users().update(user_once.key, user);
  }

  async get_baby_once(key: string): Promise<any> {
    return (await this._get_baby_obs(key).$ref.once('value')).val();
  }

  async get_my_babies_once(): Promise<any> {
    if (!this.mybabies) { this.set_my_babies(); }
    return (await this.mybabies.$ref.once('value')).val();
  }

  private _get_my_babies_obs(): FirebaseListObservable<any> {
    if (!this.mybabies) { this.set_my_babies() }
    return this.mybabies;
  }

  get_my_babies_obs(): Observable<any> {
    if (!this.mybabies) { this.set_my_babies() }
    return this.mybabies;
  }

  async delete_nursing_log(key: string): Promise<void> {
    await this._get_nursing_log(key).remove();
  }

  async delete_pumping_log(key: string): Promise<void> {
    await this._get_pumping_log(key).remove();
  }

  async delete_diaper_log(key: string): Promise<void> {
    await this._get_diaper_log(key).remove();
  }

  async get_users_once(phone: string): Promise<any> {
    return (await this._get_users().$ref.orderByChild('phone').equalTo(phone).once('value')).val();
  }

  is_logged_in(): boolean {
    let user = firebase.auth().currentUser;
    if (user) { return true; }
    return false;
  }

  async create_user(email: string, password: string): Promise<void> {
    await this.af.auth.createUser({ email: email, password: password });
  }

  async login(email, phone, passwd): Promise<void> {
    this.auth_state = this.af.auth.login({ email: email, password: passwd },
      { provider: AuthProviders.Password, method: AuthMethods.Password });
    await this.auth_state;
  }

  //#region Image Uploader
  public async upload_image(imgname: string, fileurl: string, progress_handler: any, error_handler: any, complete_handler: any): Promise<string> {
    let storage = this.get_storage_ref();
    var storageref = storage.child('images/' + imgname);
    var metadata: firebase.storage.UploadMetadata = { contentType: 'image/jpeg' };
    var uploadTask: firebase.storage.UploadTask = storageref.putString(fileurl, 'base64', metadata);
    uploadTask.on('state_changed', progress_handler, error_handler, complete_handler);
    await uploadTask;
    return uploadTask.snapshot.downloadURL;
  }
  //#endregion Image Uploader

}
