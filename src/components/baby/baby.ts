import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'baby',
  templateUrl: 'baby.html'
})
export class BabyComponent {
  @Input() id: string;
  @Input() img: string;
  @Input() name: string;
  @Input() dob: string;
  @Input() gender: string;
  @Input() momsname: string;
  @Output() babyclick: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  clicked() {
    this.babyclick.emit(this.id);
  }
}
