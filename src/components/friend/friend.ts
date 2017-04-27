import { Input, Component, Output, EventEmitter } from '@angular/core';
import { InviteState } from '../../library/entities';
//import * as Enumerable from 'linq';

@Component({
  selector: 'friend',
  templateUrl: 'friend.html'
})
export class FriendComponent {
@Input() name: string;
@Input() email: string;
@Input() phone: string;
@Input() invitestate: InviteState;
@Input() notificationCount: number;
@Output() invite: EventEmitter<string[]> = new EventEmitter<string[]>();

showInvite: boolean;
showInviteSent: boolean;

  constructor() {
  }

  ngOnInit() {
    this.showInvite = this.invitestate == InviteState.NoInviteSent;
    this.showInviteSent = this.invitestate == InviteState.InviteSent;
  }

  inviteClicked() {
    //this.invite.emit(Enumerable.from(this.friend.contact.emails).select(e => e.value).toArray());
  }
}
