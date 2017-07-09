import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactFieldType, IContactField, IContactFindOptions, ContactField } from '@ionic-native/contacts';
import 'rxjs/add/operator/map';
import { MyContact, MyContactField } from '../library/entities';
import * as Enumerable from 'linq';

@Injectable()
export class MyContacts {

  constructor(public contacts: Contacts) {
  }

  async get_my_contacts(): Promise<MyContact[]> {
    var contacts = await this.contacts.find(["*"], { hasPhoneNumber: true });
    return Enumerable.from(contacts).select(c => this.toMyContact(c)).toArray();
  }

  private toMyContact(contact: Contact): MyContact {
    var mycontact = new MyContact();
    mycontact.displayName = contact.displayName;
    mycontact.phoneNumbers = Enumerable.from(contact.phoneNumbers)
      .select(p => this.toMyContactField(p)).toArray();
    mycontact.emails = Enumerable.from(contact.emails)
      .select(e => this.toMyContactField(e)).toArray();
    return mycontact;
  }

  private toMyContactField(field: IContactField): MyContactField {
    var my_contact_field = new MyContactField();
    my_contact_field.pref = field.pref;
    my_contact_field.type = field.type;
    my_contact_field.value = field.value;
    return my_contact_field;
  }
}
