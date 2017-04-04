import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'baby',
  templateUrl: 'baby.html'
})
export class BabyComponent {
  @Input() id: string;
  @Output() share: EventEmitter<any> = new EventEmitter<any>();
  @Output() show: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();

  showShareToolbar: boolean = false;
  email: string;

  baby: FirebaseObjectObservable<any>;

  constructor(public af: AngularFire) {
  }

  deleteClicked() {
    this.delete.emit(this.id);
  }

  showClicked() {
    this.show.emit(this.id);
  }

  shareClicked() {
    this.share.emit({id: this.id, email: this.email});
    this.email = '';
    this.showShareToolbar = false;
  }

  showShare() {
    this.showShareToolbar = true;
  }

  ngOnInit() {
    this.baby = this.af.database.object('/Babies/' + this.id);
  }

  getName(baby: any): string {
    if (baby == null) {return '';}
    return baby.name;
  }

  getDob(baby: any): string {
    if (baby == null) {return '';}
    return moment(baby.dob).format('MMM DD YYYY');
  }

  getGender(baby: any): string {
    if (baby == null) {return 'u';}
    return baby.gender
  }

  getMomsName(baby: any): string {
    if (baby == null) {return '';}
    return baby.momsname
  }

  getImgUrl(baby: any) : string {
    if (baby == null || baby.imgUrl == '' || baby.imgUrl == 'dummy') {return 'assets/resources/baby2.jpg';}
    return baby.imgUrl;
  }
}
