import { Component, Input, Output, EventEmitter } from '@angular/core';
import {TimeVol, Time} from '../../library/entities';

@Component({
  selector: 'time-date-vol',
  templateUrl: 'time-date-vol.html'
})
export class TimeDateVolComponent {
@Input() volumelabel: string;
@Input() defaultDate: string;
@Input() defaultVolume: number;
@Output() save: EventEmitter<TimeVol> = new EventEmitter<TimeVol>();
@Input() note: string;

inputDate: string;
time: string;
date: string;
volume: number;
notes: string;

  constructor() {
  }

  ngOnInit() {
    this.inputDate = this.defaultDate;
    this.time = this.defaultDate;
    this.date = this.defaultDate;
    this.volume = this.defaultVolume;
    this.notes = this.note;
  }

  updatetimedate(ev:Time) {
    this.time = ev.time;
    this.date = ev.date;
  }

  saveClicked() {
    this.save.emit({
      time: this.time,
      date: this.date,
      volume: this.volume,
      note: this.notes
    });
  }

}
