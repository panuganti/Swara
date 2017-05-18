import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../providers/firebase-service';
import { Baby } from '../../library/entities';

@Component({
  selector: 'baby',
  templateUrl: 'baby.html'
})
export class BabyComponent {
  @Input() id: string;
  @Input() admin: boolean;
  @Output() share: EventEmitter<any> = new EventEmitter<any>();
  @Output() show: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();

  baby: Baby;
  showShareToolbar: boolean = false;
  email: string;
  color: string = "border-left: 2px solid blue;";
  name: string;
  dob: string;
  img: string;
  gender: string;
  momsname: string;

  constructor(private fbs: FirebaseService) {
  }

  ngOnInit() {
    this.init();
  }

  do_nothing() {
    debugger;
  }

  async init() {
    let baby = await this.fbs.get_baby_once(this.id);
    if (baby && baby != null) {
      this.name = baby[0].name;
      this.dob = baby[0].dob;
      this.gender = baby[0].gender;
      this.momsname = baby[0].momsname;
      this.img = baby[0].imgUrl;
    }
  }

  async deleteClicked() {
    this.fbs.delete_baby_from_my_babies(this.id);
    if (this.admin) {
      this.fbs.delete_nursing_log(this.id);
      this.fbs.delete_pumping_log(this.id);
      this.fbs.delete_diaper_log(this.id);
      this.fbs.delete_baby(this.id);
    }
      this.delete.emit();
  }

  showClicked() {
    this.show.emit(this.id);
  }

  showShare() {
    console.log('share');
  }
}
