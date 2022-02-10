import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTimeMarkerComponent } from './current-time-marker.component';

describe('CurrentTimeMarkerComponent', () => {
  let component: CurrentTimeMarkerComponent;
  let fixture: ComponentFixture<CurrentTimeMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentTimeMarkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTimeMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
