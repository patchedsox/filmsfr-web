import { Component, OnInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { debounce } from 'lodash';
import {
  GetNearbyLocationsResponse,
  GetNearbyLocations,
  ActionResponse,
  FilmLocationSchema,
  SolveRoutingProblemResponse
} from 'goldengate24k';
import { Observable } from 'rxjs/Observable';
import * as turf from '@turf/turf';
import { GeoHelpers } from '../../services/geo-helpers.service';
import { point } from '@turf/turf';
import { MatButton } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { AppActions } from '../../app.store-actions';
import { select } from '@angular-redux/store';
import * as mapbox from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { MapboxMarker } from '../../models.ts/mapbox';
import { MapboxComponent } from '../mapbox/mapbox.component';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {
  lngLat = {
    lat: 37.743510,
    lng: -122.432504
  };

  center = [this.lngLat.lng, this.lngLat.lat];

  bounds: mapbox.LngLat;
  radius: FormControl;
  zoom = 15;

  subs: Array<Subscription> = [];
  selectedResult: FilmLocationSchema;

  @ViewChild(MapboxComponent) map: MapboxComponent;
  @ViewChild(LocationSearchComponent) locationSearch: LocationSearchComponent;

  click: Subject<void> = new Subject();

  @select(['currentLocations']) locations: Observable<FilmLocationSchema[]>;
  @select(['currentRouteSolution']) routeSolution: Observable<SolveRoutingProblemResponse>;

  constructor(private geoHelpers: GeoHelpers, private appActions: AppActions, private fb: FormBuilder) {
    this.radius = this.fb.control(1000);
  }

  ngOnInit() {
    this.registerLocations();
    this.registerMarkers();
    this.registerSearch();
    this.registerRoutingSolution();
    this.appActions.setCenter(this.lngLat as any);
  }

  registerRoutingSolution() {
    this.subs.push(
      this.routeSolution.map(m => {
        this.map.removeRoutes();
        this.map.removeAllMarkers();

        if (!m.locationsWithRouteCoordinates) {
          return;
        }
        this.appActions.loadLocations(m.locationsWithRouteCoordinates);
        this.map.drawRoutes(m.locationsWithRouteCoordinates);
        this.appActions.loadLocations(m.locationsWithRouteCoordinates);

        this.map.fitBounds();
      })
        .subscribe()
    );
  }

  registerSearch() {
    this.subs.push(
      this.locationSearch.selectedResult
        .map(l => {
          this.map.removeAllMarkers();
          this.map.removeRoutes();
          this.map.addMarkers([this.makeMarker(l).panToSelf()]);
        }).subscribe());
  }

  registerLocations() {
    this.subs.push(this.map.centerChange
      .switchMap(() => this.click).flatMap(() => {
        this.map.removeAllMarkers();
        this.map.removeRoutes();
        this.appActions.setCenter(this.map.nativeMap.getCenter());
        const center = this.map.nativeMap.getCenter();
        const bounds = this.map.nativeMap.getBounds();
        const radius = this.radius.value;
        return this.getNearbyLocations(center, radius);
      }).subscribe());
  }

  makeMarker(l: FilmLocationSchema) {
    return new MapboxMarker({
      position: [l.coordinates.lng, l.coordinates.lat],
      data: l,
      popupText: l.title,
      pointType: 'location',
      pointId: l.id,
      pointSize: 30
    });
  }

  registerMarkers() {
    this.subs.push(this.locations.map(m => m.map(l => this.makeMarker(l))).map(markers => {
      this.map.upsertMarkers(markers);
    }).subscribe());
  }

  getNearbyLocations(lngLat: mapbox.LngLat, radius: number) {
    return Observable.fromPromise(new GetNearbyLocations({
      radius: radius,
      coordinates: lngLat
    }).send()).map(r => {
      this.appActions.loadLocations(r.value.locations);
    });
  }

  showArea() {
    this.click.next();
  }

  ngOnDestroy(): void {
    this.subs.forEach(m => m.unsubscribe());
  }
}
