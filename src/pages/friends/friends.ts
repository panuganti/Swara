import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { Friend, InviteState } from '../../library/entities';
import { Utils } from '../../library/utils';
import * as Enumerable from 'linq';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  contacts: Contact[];
  contactStatus: Friend[];
  inNetworkContacts: Friend[];
  notInNetworkContacts: Friend[];
  users: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public contactsCtrl: Contacts, public af: AngularFire, public utils: Utils) { }

  getInNetworkContacts(contactsWithStatus: Friend[]) {
    return Enumerable.from(contactsWithStatus).where(c => c.state == InviteState.InNetwork).toArray();
  }

  getNotInNetworkFriends(contactsWithStatus: Friend[]) {
    return Enumerable.from(contactsWithStatus).where(c => c.state != InviteState.InNetwork).toArray();
  }

  getNotificationCount(friend: Friend): number {
    return 0;
  }

  invite(friend: Friend) {
    // Ask user which email they want to send invite to.
    console.log('sending invite to ' + friend.accountemail);
  }

  ionViewDidLoad() {
    this.users = this.af.database.list('/Users');
    this.loadContacts();
  }

  loadContacts() {
    this.contactsCtrl.find(["*"], { hasPhoneNumber: true }).then((contacts) => { 
      Enumerable.from(contacts).select(c => this.contactStatus.push( {contact: c, state: InviteState.NoInviteSent}));
      Enumerable.from(contacts).select(c => this.IsInNetwork(c));
     });
  }

  IsInNetwork(contact: Contact): boolean {
    for (var email of contact.emails) {
      var ref = firebase.database().ref('/Users');
      var ref = firebase.database().ref('/Invites');
      ref.orderByChild("accountemail").equalTo(email.value).on("value", (snapshot) => {
        console.log(snapshot);
          var contact_with_the_email = Enumerable.from(this.contactStatus).where(cs => Enumerable.from(cs.contact.emails).any(e => e == email)).first();
        if (snapshot.hasChildren()) {
          var state = snapshot.child('key/state').val();
          if ( state == 'inNetwork')
          {
            contact_with_the_email.state = InviteState.InNetwork;
          }
          else if (state == '')
          {
            contact_with_the_email.state = InviteState.InviteSent;
          }
          else {
            contact_with_the_email.state = InviteState.NoInviteSent;            
          }
        }
        else {
            contact_with_the_email.state = InviteState.NoInviteSent;            
        }
      })
    }
    return false;
  }
}
