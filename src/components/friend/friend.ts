import { Input, Component, Output, EventEmitter } from '@angular/core';
import { Friend, InviteState } from '../../library/entities';
import * as Enumerable from 'linq';

@Component({
  selector: 'friend',
  templateUrl: 'friend.html'
})
export class FriendComponent {
@Input() contact: Friend;
@Input() notificationCount: number;
@Output() invite: EventEmitter<string[]> = new EventEmitter<string[]>();

showInvite: boolean;
showInviteSent: boolean;

  constructor() {
  }

  ngOnInit() {
    this.showInvite = this.contact.state == InviteState.NoInviteSent;
    this.showInviteSent = this.contact.state == InviteState.InviteSent;
  }

  inviteClicked() {
    this.invite.emit(Enumerable.from(this.contact.contact.emails).select(e => e.value).toArray());
  }
}
