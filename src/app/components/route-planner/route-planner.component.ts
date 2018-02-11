import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { FilmLocationSchema, SolveRoutingProblem } from 'goldengate24k';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import { AppActions } from '../../app.store-actions';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.scss']
})
export class RoutePlannerComponent implements OnInit {
  @select(['currentCenter']) currentCenter: Observable<LatLngLiteral>;

  route = Observable.of(<FilmLocationSchema[]>[]);
  click: Subject<void> = new Subject();

  constructor(private appActions: AppActions) { }

  ngOnInit() {
    this.route = this.currentCenter
      .switchMap((center) => this.click.mapTo(center))
      .switchMap(center => {
        return this.solveRouteObs(center);
      })
      .map(c => c.value.locations);
  }

  solveRoute() {
    this.click.next();
  }

  selectLocation(index: number) {
    this.appActions.selectLocation(index);
  }

  unselectLocation(index: number) {
    this.appActions.unselectLocation(index);
  }

  solveRouteObs(center: LatLngLiteral) {
    return Observable.fromPromise(new SolveRoutingProblem({
      coordinates: center
    }).send()
      .then(solved => {
        this.appActions.solveRoute(solved.value);
        return solved;
      }));
  }
}
