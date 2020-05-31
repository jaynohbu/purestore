import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'dialog-unground-confirm-single',
  templateUrl: './dialog-unground-confirm-single.component.html',
  styleUrls: ['./dialog-unground-confirm-single.component.scss']
})
export class DialogUngroundConfirmSingleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogUngroundConfirmSingleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Boolean) { }

  ngOnInit() {
  }

}
