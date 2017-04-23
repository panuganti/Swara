import { Component } from '@angular/core';

/*
  Generated class for the Feeding component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'feeding',
  templateUrl: 'feeding.html'
})
export class FeedingComponent {

  text: string;

  constructor() {
    console.log('Hello Feeding Component');
    this.text = 'Hello World';
  }

}
