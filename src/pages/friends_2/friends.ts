import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyContacts } from '../../providers/my-contacts';
import * as Enumerable from 'linq';
import { ChatRoom, MyContact, MyContactField } from '../../library/entities';
import {  User} from '../../library/fb-entities';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import 'rxjs/add/operator/toPromise';
//import { FirebaseService } from '../../providers/firebase-service';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage_2 {
  chats: ChatRoom[];
  users: FirebaseListObservable<any>;
  chatrooms: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public mycontacts: MyContacts, public af: AngularFire) { }

  ionViewDidLoad() { 
  //  this.load_contacts(); 
  }

/*
  async load_contacts() {
    debugger;
    let myself = await this.get_me();
    let contacts = await this.mycontacts.get_my_contacts();
    let flattened_contacts = Enumerable.from(contacts)
      .selectMany(c => Enumerable.from(c.phoneNumbers)
        .select(p => this.toMyContact(p, c)))
      .where(c => this.isAValidContact(c));
    this.chats = await Promise.all(await flattened_contacts
      .select(async c => await this.load_chat_room(c, myself)).distinct().toArray());
  }

  async load_chat_room(contact: MyContact, me: User): Promise<ChatRoom> {
    //    1. Look in Users if anyone with the phone number
    var userMap = (await this.af.database.list('/Users').$ref.orderByChild('phone')
                      .equalTo(contact.phoneNumbers[0].value).once('value')).val();
    //    2. if not, generate not-in-network chatroom and return;
    if (userMap == null) {
      return { title: contact.displayName, inNetwork: false };
    }

    //  3. User exists but not chatroom, return empty chatroom
    let user: User = Enumerable.from(userMap).first().value;
    let roomid = this.get_room_id(me.phone, user.phone);
    var chatroom: any = (await this.af.database.list('/ChatRoom_' + roomid).$ref.once('value')).val();
    if (chatroom == null) {
      return { _ids: [user.phone, me.phone], _roomid: roomid, title: contact.displayName, picture: user.picture, inNetwork: true };
    }

    //  4. Get last message from the chatroom    
    chatroom.lastMessage = Enumerable.from(chatroom).last().value;
    return chatroom;
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
    let meMap: MyContact = (await this.af.database.list('/Users').$ref
      .orderByChild('phone').equalTo(phone).once('value')).val();
    let me: User = Enumerable.from(meMap).first().value;
    return me;
  }

  get_room_id(id1: string, id2: string): string {
    if (id1 < id2) { return id1 + '_' + id2; }
    return id2 + '_' + id1;
  }

  showMessages(chat): void {
  }
*/
}
