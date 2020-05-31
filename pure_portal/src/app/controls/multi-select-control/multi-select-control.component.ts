import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AutocompletSelection } from '../../model/AutocompletSelection';



@Component({
  selector: 'multi-select',
  templateUrl: './multi-select-control.component.html',
  styleUrls: ['./multi-select-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectControlComponent implements OnInit {
  multiSelectInputControl = new FormControl();
  multiSelectControl = new FormControl();
  options: string[] = [];
  uiRef: any;
  filteredOptions: Observable<string[]>;
  @ViewChild('txtInput') input;
  @ViewChild('allSelected') allSelected;
  @ViewChild('allSelected') selTrigger;

  @Input() dataSource: string;
  @Input() defaultSelections: AutocompletSelection[];
  @Input() placeholder: string = "STATION(S)"
  @Input() allText: string = "ALL STATIONS"
  @Input() singleChoice: boolean=false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  firstLoad: boolean = true;
  selectedValue: string;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selections: AutocompletSelection[] = [];
  allvalues: AutocompletSelection[] = [];
  @Output() listSelected = new EventEmitter();
  setFocusOnInput() {

    setTimeout(() => {
      this.input.nativeElement.click();
      this.input.nativeElement.focus();
    },
      10);
  }
  optionClick(name, ev) {
    
    console.log(ev)
    //this.input.nativeElement.value='';
    let selection = this.allvalues.find(a => a.name == name);
    if (this.allSelected.selected) {
      this.allSelected.deselect();
    }
     if (this.singleChoice) {
      this.selections = [];
      this.multiSelectControl.patchValue([]);
       if (!ev.target.classList.contains('mat-pseudo-checkbox-checked')) {
        this.selections.push(selection);
        if (this.singleChoice) {
          this.multiSelectControl.setValue([name]);
         
        }
      }
  
     
      this.listSelected.emit(this.selections.map(a => a.value).join(','))
      return;
    }
   
    if (ev.target.classList.contains('mat-pseudo-checkbox-checked')) {//unchecked

      this.selections = this.selections.filter(s => s.name !== name);
    } else {//checked

      let exists = this.selections.find(a => a.name == name);
      if (!exists)
        this.selections.push(selection);

    }
   
    this.listSelected.emit(this.selections.map(a => a.value).join(','))
    return false;

  }
  toggleAllSelection() {
    this.input.nativeElement.value = '';
    this.selections = [];
    if (this.allSelected.selected) {
      this.listSelected.emit('');
    } else {
      this.multiSelectControl.patchValue([]);
    }

  }

  getSelectedString() {
    let names = [];
    this.selections.map((e) => {
      if (e)
        names.push(e.name);
    });
    return names.join(',');

  }

  ngOnChanges(changes: any) {
    this.options = [];
    setTimeout(() => {
      if (this.dataSource)
        this.allvalues = JSON.parse(this.dataSource);
      this.allvalues.map(e => {
        this.options.push(e.name)
      });

    }, 10);

  }

  offset(el) {
    if (!el) return;
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  multiClick(){
    if (this.selections.length == 1 && this.selections[0].name == this.allText) {
      setTimeout(() => {
        if (this.singleChoice) {
  
          this.multiSelectControl.patchValue([]);
        }
        let elmts = document.querySelectorAll(".mat-option-multiple");
        let elmt = elmts[0] as HTMLElement;
        elmt.click();
       

      }, 100);
    }
  }

  fillAll() {
    this.multiSelectInputControl.setValue('');
    setTimeout(() => {
    let elmt= document.querySelector(".multi-select-input") as HTMLElement;
    elmt.focus();
    }, 200);
  }
  ngOnInit() {
    if (this.defaultSelections.length > 0) {
      this.selections.push(this.defaultSelections[0]);
      if (this.selections.length == 1 && this.selections[0].name==this.allText){
        setTimeout(() => {
         
          this.listSelected.emit('');
        }, 300);
      }
      setTimeout(() => {
        let elm = document.querySelector('.mat-select-arrow') as HTMLElement;
        this.uiRef = this.offset(elm);
        if (!elm) return;
       
        this.multiSelectControl.patchValue([this.defaultSelections[0].name]);
        this.multiSelectInputControl.setValue(this.defaultSelections[0].name);

      }, 100);
    }
    this.filteredOptions = this.multiSelectInputControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {

    if (!value) {
      return this.options;
    }


    const filterValue = value.toLowerCase();
    let ret: string[] = [];
    let filtred = this.options.filter(option => {
      return option.toLowerCase().indexOf(filterValue) === 0
    });
    let filtredString = filtred.reverse().join(',');
    ret = filtredString.split(',');
    if (ret.length == 1) {
      if (ret[0] == '') {
        ret = [];
      }

    }
    this.selections.map(e => {
      if (!filtred.find(a => a == e.name))
        ret.push(e.name);
    });
    setTimeout(() => {

      this.input.nativeElement.focus();
      if (document.querySelector('.mat-select-panel'))
        document.querySelector('.mat-select-panel').scrollTop = 0;

    }, 500);
    return ret;

  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('dropdown', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/arrow_drop_down-24px.svg'));
  }

}