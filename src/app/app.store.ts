import { Action, AnyAction } from 'redux';
import { AppActions } from './app.store-actions';
import { FilmLocationSchema, SolveRoutingProblemResponse } from 'goldengate24k';
import { LatLngLiteral } from '@agm/core';
import { tassign } from 'tassign';

export interface AppState {
  currentCenter: LatLngLiteral;
  currentLocations: Array<FilmLocationSchema & { selected: boolean }>;
  currentRouteSolution: SolveRoutingProblemResponse;
}

export const INITIAL_STATE: AppState = {
  currentCenter: { lng: 0, lat: 0 },
  currentLocations: [],
  currentRouteSolution: {
    locations: [],
    route: {
      waypoints: [],
      routes: []
    }
  }
};

// tslint:disable-next-line:no-any
export function rootReducer(lastState: AppState, action: AnyAction): AppState | any {
  switch (action.type) {
    case AppActions.LOAD_LOCATIONS:
      return tassign(
        lastState,
        {
          currentLocations: action.value
        }
      );
    case AppActions.SOLVE_ROUTE:
      return tassign(
        lastState,
        {
          currentLocations: action.value.locations,
          currentRouteSolution: action.value
        }
      );
    case AppActions.SET_CURRENT_CENTER:
      return tassign(
        lastState,
        {
          currentCenter: action.value
        }
      );
    case AppActions.SELECT_LOCATION:
      const locsSelect = lastState.currentLocations.concat();
      locsSelect[action.value].selected = true;
      return tassign(
        lastState,
        {
          currentLocations: locsSelect
        }
      );
    case AppActions.UNSELECT_LOCATION:
      const locsUnselect = lastState.currentLocations.concat();
      locsUnselect[action.value].selected = false;
      return tassign(
        lastState,
        {
          currentLocations: locsUnselect
        }
      );
  }
  return lastState;
}
