import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
//import { MessagesPage } from '../messages/messages';
import { Contacts, Contact, ContactField } from '@ionic-native/contacts';
import * as Enumerable from 'linq';
import { ChatRoom, Message, User } from '../../library/entities';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  chats: ChatRoom[];
  users: FirebaseListObservable<any>;
  chatrooms: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public contacts: Contacts, public af: AngularFire) { }
  ionViewDidLoad() { this.load_contacts(); }

  async load_contacts() {
    let contacts = await this.contacts.find(["*"], { hasPhoneNumber: true });
    // TODO: Filter Out Bad phone numbers
    let flattened_contacts: Enumerable.IEnumerable<Contact> = Enumerable.from(contacts).selectMany(c =>
      Enumerable.from(c.phoneNumbers).where(p => this.isValidPhone(p.value)).select(p => {
        let contact = new Contact();
        contact.displayName = c.displayName;
        contact.phoneNumbers = [new ContactField(p.type, p.value, p.pref)];
        contact.emails = c.emails;
        return contact;
      }).toArray());
    let myself = await this.get_me();
    this.chats = await Promise.all(await flattened_contacts.select(async c => await this.load_chat_room(c, myself)).toArray());
  }

  async get_me(): Promise<User> {
    let phone = window.localStorage.getItem('phone');
    let query = { orderByChild: 'phone', equalTo: phone };
    let me = await this.af.database.list('/Users', query).toPromise();
    let displayName = me[0].displayName;
    let myemail = me[0].email;
    let mypic = me[0].pic;
    let key = me[0].$key;
    return { displayName: displayName, phone: phone, email: myemail, picture: mypic, $key: key };
  }

  // only reduces the network traffic
  isValidPhone(phone: string): boolean {
    return true; // TODO:
  }

  async load_chat_room(contact: Contact, me: User): Promise<ChatRoom> {
    //    1. Look in Users if anyone with the phone number
    let user_query = { orderByChild: 'phone', equalTo: contact.phoneNumbers[0].value };
    var user = await this.af.database.list('/Users', user_query).toPromise();
    //    2. if not, generate not-in-network chatroom and return;
    if (!user || user == null) {
      return { title: contact.displayName, inNetwork: false };
    }
    //    3. Get users pic, name, id
    let userpic: string = user[0].picture;  // TODO:
    //    4. Search for chatroom with id1, id2 
    let roomid = this.get_room_id(me.$key, user[0].$key);
    // TODO: Use Query to limit number
    var messages: Message[] = await this.af.database.list('/ChatRoom' + roomid).toPromise();
    let chatroom: ChatRoom = { _ids: [user[0].$key, me.$key], _roomid: roomid, title: contact.displayName, picture: userpic, inNetwork: true };
    //    5. if not exists, return empty chatroom
    if (!messages || messages == null || messages.length == 0) {
      return chatroom;
    }
    //    6. Get last message from the chatroom    
    chatroom.lastMessage = messages[messages.length - 1];
    return chatroom;
  }

  get_room_id(id1: string, id2: string): string {
    if (id1 < id2) { return id1 + '_' + id2; }
    return id2 + '_' + id1;
  }

  showMessages(chat): void {
  }

  removeChat(chat: any): void {
  }

}
