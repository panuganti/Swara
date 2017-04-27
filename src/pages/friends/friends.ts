import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, IContactField } from '@ionic-native/contacts';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { Friend, InviteState } from '../../library/entities';
import { Utils } from '../../library/utils';
import * as Enumerable from 'linq';
import { MyContact, MyContactField, mycontacts } from '../../providers/contacts';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  contacts: Contact[];
  contactStatus: Friend[] = [];
  inNetworkContacts: Friend[] = [];
  notInNetworkContacts: Friend[] = [];
  users: FirebaseListObservable<any>;
  segment: string = 'friends';

  constructor(public navCtrl: NavController, public contactsCtrl: Contacts, public af: AngularFire, public utils: Utils) { }

  ionViewDidLoad() {
    this.users = this.af.database.list('/Users');
    this.loadContacts();
  }

  loadContacts() {
    var pContacts = Promise.resolve(mycontacts);
    //var pContacts = this.contactsCtrl.find(["*"], { hasPhoneNumber: true });
    pContacts.then((contacts) => { 
      Enumerable.from(contacts).where(c => Enumerable.from(c.emails).any()).select(c => this.contactStatus.push({ contact: c, state: InviteState.NoInviteSent, accountemail: c.emails[0].value, name: c.displayName})).toArray();  // Populate contactStatus
      Enumerable.from(contacts).select(c => this.IsInNetwork(c)).toArray(); // Populate their in network status
    });
  }

  showFriends() {}
  showInvites() {}

  IsInNetwork(contact: MyContact): boolean {
    for (var email of contact.emails) {
      var ref = firebase.database().ref('/Users');
      ref.orderByChild("accountemail").equalTo(email.value).on("value", (snapshot) => {
          var contact_with_the_email = Enumerable.from(this.contactStatus)
              .where(cs => Enumerable.from(cs.contact.emails).any(e => e == email)).first();
        if (snapshot.hasChildren()) {
          var state = snapshot.child('key/state').val();
          if ( state == 'in_network')
          {
            contact_with_the_email.state = InviteState.InNetwork;
          }
          else if (state == 'invite_sent')
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

    getInNetworkContacts() : Friend[] {
    var list =  Enumerable.from(this.contactStatus).where(c => c.state == InviteState.InNetwork).toArray();
    return list;
  }

  getNotInNetworkFriends(): Friend[] {
    var list = Enumerable.from(this.contactStatus).where(c => c.state != InviteState.InNetwork).toArray();
    return list;
  }

  getNotificationCount(friend: Friend): number {
    return 0;
  }

  invite(friend: Friend) {
    // Ask user which email they want to send invite to.
    console.log('sending invite to ' + friend.accountemail);
  }

  toMyContact(c: Contact) : MyContact {
    var mc: MyContact = new MyContact();
    var phones: MyContactField[] = Enumerable.from(c.phoneNumbers).select(p => this.toMyContactField(p) ).toArray();
    var emails: MyContactField[] = Enumerable.from(c.emails).select(e => this.toMyContactField(e)).toArray();
    mc.displayName = c.displayName;
    mc.phoneNumbers = phones;
    mc.emails = emails;
    return mc;
  }

  toMyContactField(cf: IContactField): MyContactField {
      var mcf = new MyContactField();
      mcf.pref = cf.pref;
      mcf.value = cf.value;
      mcf.type = cf.type;    
      return mcf;
  }

}
