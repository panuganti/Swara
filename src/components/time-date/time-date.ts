import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Time } from '../../library/entities';

@Component({
  selector: 'time-date',
  templateUrl: 'time-date.html'
})
export class TimeDateComponent {
  @Input() defaultDate: string;
  time: string;
  date: string;
  @Output() timedate: EventEmitter<Time> = new EventEmitter<Time>(); 

  constructor() {
  }

  ngOnInit() {
    this.time = this.defaultDate;
    this.date = this.defaultDate;
  }

  update() {
    this.timedate.emit({
      time: this.time,
      date: this.date
    });
  }
}
