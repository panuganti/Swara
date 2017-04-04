import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'baby-header',
  templateUrl: 'baby-header.html'
})
export class BabyHeaderComponent {
  @Input() title: string;
  @Output() showBabies: EventEmitter<any> = new EventEmitter<any>();
  @Output() logout: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  babies() {
    this.showBabies.emit();
  }

  logoutClicked() {
    this.logout.emit();
  }

}
