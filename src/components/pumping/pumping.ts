import { Input, Component, Output, EventEmitter } from '@angular/core';
import {  TimeVol} from '../../library/entities';

@Component({
  selector: 'pumping',
  templateUrl: 'pumping.html'
})
export class PumpingComponent {
@Input() pumpingDate: string;
@Input() pumpingVolume:string;
@Input() key: string;
@Input() editType: boolean
@Output() save: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
  }

  savePumping(timevol: TimeVol) {
    this.save.emit({
      timedatevol: timevol,
      edit: this.editType,
      key: this.key
    });
  }

}
