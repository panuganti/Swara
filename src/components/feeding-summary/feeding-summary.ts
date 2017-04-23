import { Input, Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { TimeVolType } from '../../library/entities';
import * as Enumerable from 'linq';
import * as moment from 'moment';

@Component({
  selector: 'feeding-summary',
  templateUrl: 'feeding-summary.html'
})
export class FeedingSummaryComponent {
@Input() feeding:  FirebaseListObservable<any>;
@Input() yestfeeding:  FirebaseListObservable<any>;
  expandFeedingList: boolean = false;

  constructor(public af: AngularFire) {
  }

  toggleFeeding() {
    this.expandFeedingList = !this.expandFeedingList;
  }

  getLastFeedType(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if ((feeding != null) && (Enumerable.from(feeding).count() > 0)) {
      this.showNoFeedingText = false;
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      var type = lastelement.type;
      switch (type) {
        case 'pumped': return 'Pumped ' + lastelement.volume + ' ml ';
        case 'breastfeeding': return 'Breast-fed for ' + lastelement.volume + ' mins ';
        case 'formula': return 'Fed formula ' + lastelement.volume + ' ml ';
        default: return '';
      }
    }
    return '';
  }

  showNoFeedingText: boolean = false;
  getLastFeedTime(feeding: TimeVolType[], yestfeeding: TimeVolType[]): string {
    if (feeding == null || (Enumerable.from(feeding).count() == 0)) {
      if (yestfeeding == null || (Enumerable.from(yestfeeding).count() == 0)) {
        this.showNoFeedingText = true;
        return '';
      }
      else {
        this.showNoFeedingText = false;
        var lastelement = Enumerable.from(yestfeeding).orderByDescending(f => moment(f.time).valueOf()).first();
        return this.getTimeInHoursAndMins(lastelement.time);
      }
    }
    else {
      this.showNoFeedingText = false;
      var lastelement = Enumerable.from(feeding).orderByDescending(f => moment(f.time).valueOf()).first();
      return this.getTimeInHoursAndMins(lastelement.time);
    }
  }

    getTimeInHoursAndMins(time: string): string {
    var d = moment.duration(moment().diff(moment(time)));
    var h = Math.floor(d.asHours());
    var m = Math.floor(d.asMinutes() - h * 60);
    if (h == 0) { return '' + m + ' mins ago'; }
    return '' + h + ' hrs and ' + m + ' mins ago';
  }

  editFeeding(feed) {
    /*
    this.feedingDate = feed.date;
    this.feedingVolume = feed.volume;
    this.editType = true;
    this.key = feed.$key;
    */
  }


}
