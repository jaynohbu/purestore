import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'body-container',
  templateUrl: './body-container.component.html',
  styleUrls: ['./body-container.component.scss']
})
export class BodyContainerComponent implements OnInit {
  @Input() inDetail: boolean;
  constructor() { }

  ngOnInit() {
  }

}
