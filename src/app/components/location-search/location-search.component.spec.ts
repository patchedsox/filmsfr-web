import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSearchComponent } from './location-search.component';
import { SharedModule } from '../../shared/shared.module';

describe('LocationSearchComponent', () => {
  let component: LocationSearchComponent;
  let fixture: ComponentFixture<LocationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
