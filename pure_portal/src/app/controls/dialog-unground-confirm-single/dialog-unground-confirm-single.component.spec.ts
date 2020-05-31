import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUngroundConfirmSingleComponent } from './dialog-unground-confirm-single.component';

describe('DialogUngroundConfirmSingleComponent', () => {
  let component: DialogUngroundConfirmSingleComponent;
  let fixture: ComponentFixture<DialogUngroundConfirmSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUngroundConfirmSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUngroundConfirmSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
