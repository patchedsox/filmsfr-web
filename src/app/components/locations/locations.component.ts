import { Component, OnInit } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { AgmMap, LatLngBoundsLiteral } from '@agm/core';
import { AgmCircle } from '@agm/core/directives/circle';
import { LatLngLiteral, GoogleMap } from '@agm/core/services/google-maps-types';
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
import { WindowRef } from '@agm/core/utils/browser-globals';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { point } from '@turf/turf';
import { MatButton } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';
import { AppActions } from '../../app.store-actions';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, AfterViewInit, OnDestroy {
  lngLat = {
    lat: 37.743510,
    lng: -122.432504
  };

  bounds: LatLngBoundsLiteral;
  radius = 1000;
  zoom = 15;

  subs: Array<Subscription> = [];
  map: Observable<GoogleMap>;
  selectedResult: FilmLocationSchema;

  @ViewChild(AgmMap) agmMap: AgmMap;
  @ViewChild(LocationSearchComponent) locationSearch: LocationSearchComponent;

  click: Subject<void> = new Subject();

  @select(['currentLocations']) points: Observable<FilmLocationSchema[]>;

  route: Observable<google.maps.DirectionsRoute>;

  constructor(private geoHelpers: GeoHelpers, private appActions: AppActions) { }

  ngOnInit() {
    this.agmMap.zoom = this.zoom;
    this.agmMap.latitude = this.lngLat.lat;
    this.agmMap.longitude = this.lngLat.lng;
    this.agmMap.clickableIcons = false;
    this.map = this.agmMap.mapReady.map(m => m);

    this.locationSearch.debounceTime = 300;

    this.subs.push(this.map.switchMap((map) =>
      this.locationSearch.selectedResult.map(loc => {
        this.appActions.loadLocations([]);
        map.panTo(loc.coordinates);
        map.setZoom(18);
        this.selectedResult = loc;
      })
    ).subscribe());
  }

  getNearbyLocations(lngLat: LatLngLiteral, radius: number) {
    return Observable.fromPromise(new GetNearbyLocations({
      radius: radius,
      coordinates: lngLat
    }).send());
  }

  ngAfterViewInit(): void {
    this.subs.push(this.agmMap.mapReady.subscribe((map: GoogleMap) => {
      this.prepareMap(map);
      this.agmMap.centerChange.emit(this.lngLat);
      this.showArea();
    }));
  }

  prepareMap(map: GoogleMap) {
    this.subs.push(this.agmMap.boundsChange
      .switchMap(() => this.agmMap.centerChange)
      .switchMap((lngLat) => this.click)
      .flatMap(() => {
        this.selectedResult = undefined;
        const ne = map.getBounds().getNorthEast();
        const c = map.getBounds().getCenter();

        const r = turf.distance([c.lng(), ne.lat()], [c.lng(), c.lat()], { units: 'meters' });

        const center = { lat: c.lat(), lng: c.lng() };

        this.lngLat = center;

        this.appActions.setCenter(center);

        return this.getNearbyLocations(center, r).map(m => m.value ? m.value.locations : []);
      })
      .subscribe(c => {
        this.appActions.loadLocations(c);
      }));
  }

  showArea() {
    this.click.next();
  }

  ngOnDestroy(): void {
    this.subs.forEach(m => m.unsubscribe());
  }
}
