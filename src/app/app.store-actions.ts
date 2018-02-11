import { Injectable } from '@angular/core';
import { AnyAction } from 'redux';
import { FilmLocationSchema, SolveRoutingProblemResponse } from 'goldengate24k';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './app.store';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';

@Injectable()
export class AppActions {
  constructor(private ngRedux: NgRedux<AppState>) { }

  static SET_CURRENT_CENTER = 'SET_CURRENT_CENTER';
  static LOAD_LOCATIONS = 'LOAD_LOCATIONS';
  static SOLVE_ROUTE = 'SOLVE_ROUTE';
  static SELECT_LOCATION = 'SELECT_LOCATION';
  static UNSELECT_LOCATION = 'UNSELECT_LOCATION';

  loadLocations(data: FilmLocationSchema[]) {
    this.ngRedux.dispatch({ type: AppActions.LOAD_LOCATIONS, value: data });
  }
  solveRoute(data: SolveRoutingProblemResponse) {
    this.ngRedux.dispatch({ type: AppActions.SOLVE_ROUTE, value: data });
  }
  setCenter(data: LatLngLiteral) {
    this.ngRedux.dispatch({ type: AppActions.SET_CURRENT_CENTER, value: data });
  }
  selectLocation(data: number) {
    this.ngRedux.dispatch({ type: AppActions.SELECT_LOCATION, value: data });
  }
  unselectLocation(data: number) {
    this.ngRedux.dispatch({ type: AppActions.UNSELECT_LOCATION, value: data });
  }
}
