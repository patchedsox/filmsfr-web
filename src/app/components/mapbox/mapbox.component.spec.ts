import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxComponent } from './mapbox.component';

describe('MapboxComponent', () => {
  let component: MapboxComponent;
  let fixture: ComponentFixture<MapboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapboxComponent);
    component = fixture.componentInstance;
    component.center = [0, 0];
    component.zoom = 15;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
