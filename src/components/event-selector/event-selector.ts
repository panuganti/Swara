import { Output,Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'event-selector',
  templateUrl: 'event-selector.html'
})
export class EventSelectorComponent {
@Output() feeding: EventEmitter<any> = new EventEmitter<any>();
@Output() pumping: EventEmitter<any> = new EventEmitter<any>();
@Output() diapering: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  showFeeding() { this.feeding.emit();}
  showPumping() { this.pumping.emit();}
  showDiapering() { this.diapering.emit();}

}
