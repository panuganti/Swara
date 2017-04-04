import { Output, Component, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'date-selector',
  templateUrl: 'date-selector.html'
})
export class DateSelectorComponent {
  @Output() date: EventEmitter<string> = new EventEmitter<string>();
  componentDate: string;
  showNextDate: boolean;

  constructor() {
  }

  ngOnInit() {
    this.componentDate = moment().format();
    console.log(this.componentDate)
    this.showNextDate = false;
  }

  prevDate() {
    if (!this.showNextDate) {
      this.showNextDate = true;
    }
    this.componentDate = moment(this.componentDate).subtract(1, 'd').format();
    this.date.emit(this.componentDate);
  }

  nextDate() {
    var pageMoment = moment(this.componentDate);
    var todayMoment = moment();
    var diff = Math.ceil(moment.duration(pageMoment.diff(todayMoment)).asDays());
    if (diff >= -1) {
      this.showNextDate = false;
    }
    this.componentDate = moment(this.componentDate).add(1, 'd').format();
    this.date.emit(this.componentDate);
  }


}
