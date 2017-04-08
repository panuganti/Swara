import { Input, Output, Component, EventEmitter } from '@angular/core';
import { Time, Diaper } from '../../library/entities';

@Component({
  selector: 'diaper',
  templateUrl: 'diaper.html'
})
export class DiaperComponent {
  type: string;
  time: string;
  date: string;
  inputDate: string;
  disabled: boolean = true;

  @Input() defaultDate: string;
  @Input() defaultType: string;
  @Output() save: EventEmitter<Diaper> = new EventEmitter<Diaper>();


  constructor() {
  }

  ngOnInit() {
    this.inputDate = this.defaultDate;
    this.type = this.defaultType;
    this.time = this.defaultDate;
    this.date = this.defaultDate;
  }

  updatetimedate(ev: Time) {
    this.time = ev.time;
    this.date = ev.date;
  }

  saveClicked() {
    this.save.emit({
      time: this.time,
      date: this.date,
      type: this.type
    });
  }

}
