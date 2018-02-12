
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgReduxModule, NgRedux } from '@angular-redux/store';


import 'hammerjs';
import { environment } from '../../environments/environment';
import { HomeComponent } from '../pages/home/home.component';
import { LocationsComponent } from '../components/locations/locations.component';
import { LocationSearchComponent } from '../components/location-search/location-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoldenGate } from '../services/golden-gate.service';
import { GoldenGateHttp } from 'goldengate24k';
import { GeoHelpers } from '../services/geo-helpers.service';
import { InfoCardComponent } from '../components/info-card/info-card.component';
import { RoutePlannerComponent } from '../components/route-planner/route-planner.component';
import { AppActions } from '../app.store-actions';
import { AppState, rootReducer, INITIAL_STATE } from '../app.store';
import { MapboxComponent } from '../components/mapbox/mapbox.component';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatLineModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatPseudoCheckboxModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    LocationsComponent,
    LocationSearchComponent,
    InfoCardComponent,
    RoutePlannerComponent,
    MapboxComponent,
  ],
  imports: [
    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    NgReduxModule,
    BrowserModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPseudoCheckboxModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    BrowserAnimationsModule
  ],
  exports: [
    HomeComponent,
    LocationsComponent,
    LocationSearchComponent,
    InfoCardComponent,
    RoutePlannerComponent,
    MapboxComponent,

    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    NgReduxModule,
    BrowserModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPseudoCheckboxModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,

    BrowserAnimationsModule,
  ],
  providers: [
    GoldenGate,
    GeoHelpers,
    AppActions
  ]
})
export class SharedModule {
  constructor(private goldenGate: GoldenGate, private ngRedux: NgRedux<AppState>) {
    GoldenGateHttp.use(this.goldenGate);
    this.ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE
    );
  }
}
