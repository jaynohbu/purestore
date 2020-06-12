import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';


@Component({
  selector: 'uploader',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  @Output("close") close: EventEmitter<any> = new EventEmitter();
  @Input() key: string;
  constructor(public dialog: MatDialog) {

  }

  public async openUploadDialog() {
    let dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '100px' });
    dialogRef.componentInstance.key = this.key;

    try {
      let data = await dialogRef.afterClosed().toPromise();
      this.key=data.sku;
      //alert('closed'+this.key)
     
      this.close.emit(data);
    } catch (ex) {
      console.log(ex);
    }
  }
}