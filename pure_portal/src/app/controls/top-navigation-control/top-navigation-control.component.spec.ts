import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavigationControlComponent } from './top-navigation-control.component';

describe('TopNavigationControlComponent', () => {
  let component: TopNavigationControlComponent;
  let fixture: ComponentFixture<TopNavigationControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNavigationControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavigationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
