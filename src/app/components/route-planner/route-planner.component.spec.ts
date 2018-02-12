import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlannerComponent } from './route-planner.component';
import { SharedModule } from '../../shared/shared.module';

describe('RoutePlannerComponent', () => {
  let component: RoutePlannerComponent;
  let fixture: ComponentFixture<RoutePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render button text', async(() => {
    fixture = TestBed.createComponent(RoutePlannerComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button').textContent).toContain('Plan a route from most optimal 11 points');
  }));
});
