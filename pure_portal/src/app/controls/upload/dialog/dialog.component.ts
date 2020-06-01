import { Component, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material';
import { UploadService } from '../upload.service';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import {ProductService} from  '../../../service/product.service'
@Component({
  selector: 'upload-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  uploadingStatus;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  updateProgress: Subject<number>;
  uploadIndicator: Observable<number>;
  public key: string;
  token: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private uploadService: UploadService, private productService: ProductService) {
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-delete_forever-24px.svg'));
    iconRegistry.addSvgIcon('play', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-play_circle_outline-24px.svg'));
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-add_circle_outline-24px.svg'));
    iconRegistry.addSvgIcon('save', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-save_alt-24px.svg'));
    iconRegistry.addSvgIcon('cancel', sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/baseline-cancel-24px.svg'));
    this.updateProgress = new Subject<number>();
    this.uploadIndicator = this.updateProgress.asObservable();
  }

  @ViewChild('file') file;
  public uploadedFile: File;
  contentProviders = [{ text: "Adobe Captivate", value: "Captivate" }, { text: "Articulate Storyline", value: "Storyline" }];

  addFile() {
    this.file.nativeElement.click();
  }

  async onFileAdded() {
    this.uploadedFile = this.file.nativeElement.files[0];
    this.uploading = true;
   
        this.uploadingStatus = this.uploadService.upload(this.uploadedFile);
        this.primaryButtonText = 'Finish';
        this.canBeClosed = false;
        this.dialogRef.disableClose = true;
        this.showCancelButton = false;
        this.uploadingStatus.subscribe(response => {
          let val = response.done;
          this.updateProgress.next(val);
          if (val == 100) {
            this.canBeClosed = true;
            this.dialogRef.disableClose = false;
            this.uploadSuccessful = true;
            this.uploading = false;

            setTimeout(() => {
              //UPLOAD-COMPLETE
              this.dialogRef.close({ key: response.key });//pssing the key back
            }, 100);
          }
        });


  }
}