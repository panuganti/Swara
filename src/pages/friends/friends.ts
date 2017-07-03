import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyContacts } from '../../providers/my-contacts';
import * as Enumerable from 'linq';
import { MyChatRoom, ChatRoom, MyContact, MyContactField } from '../../library/entities';
import { User } from '../../library/fb-entities';

import 'rxjs/add/operator/toPromise';
import { FirebaseService } from '../../providers/firebase-service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  chats: ChatRoom[];
  users: Observable<any>;
  chatrooms: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public fbs: FirebaseService,  public mycontacts: MyContacts) {
  }

  ionViewDidLoad() {
    this.load_contacts();
  }

  async load_contacts() {
    let myself = await this.get_me();
    let contacts = await this.mycontacts.get_my_contacts();
    let flattened_contacts = Enumerable.from(contacts)
      .selectMany(c => Enumerable.from(c.phoneNumbers)
        .select(p => this.toMyContact(p, c)))
      .where(c => this.isAValidContact(c));
    this.chats = await Promise.all(await flattened_contacts
      .select(async c => await this.load_chat_room(c, myself)).distinct().toArray());
  }

  async load_chat_room(contact: MyContact, me: User): Promise<MyChatRoom> {
    //    1. Look in Users if anyone with the phone number
    //let contact_phone = contact.phoneNumbers[0].value;
    //let contact_user = await this.fbs.get_users_once(contact_phone);
    //    2. if not, generate not-in-network chatroom and return;
    //  3. User exists but not chatroom, return empty chatroom

    //  4. Get last message from the chatroom    
    return null;
  }

  isAValidContact(mycontact: MyContact): boolean {
    if (mycontact.displayName == null || mycontact.displayName.length < 2) { return false; }
    if (mycontact.phoneNumbers[0].value.length < 10 || mycontact.phoneNumbers[0].value.startsWith('1-8') || mycontact.phoneNumbers[0].value.startsWith('8')) { return false; }
    return true;
  }

  toMyContact(p: MyContactField, c: MyContact): MyContact {
    let mcf: MyContactField = { type: p.type, value: p.value, pref: p.pref };
    let contact = new MyContact();
    contact.displayName = c.displayName;
    contact.phoneNumbers = [mcf];
    contact.emails = c.emails;
    return contact;
  }

  async get_me(): Promise<User> {
    let phone = window.localStorage.getItem('phone');
    let myself = await this.fbs.get_users_once(phone);
    return myself;
  }

  showMessages(chat): void {
  }

}
