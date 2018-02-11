import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Map } from 'mapbox-gl';
import * as mapbox from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { MapboxMarker } from '../../models.ts/mapbox';
import * as cheapRuler from 'cheap-ruler';
import { Observable } from 'rxjs/Observable';
import { FilmLocationSchema } from 'goldengate24k';
import * as turf from '@turf/turf';
import { Position } from 'geojson';

(mapbox.accessToken as any) = environment.mapboxToken;

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {
  mapReady = new Subject<void>();
  dragend = new Subject<void>();
  centerChange = new Subject<mapbox.LngLat>();
  currentMarkersHash: {
    [key: string]: {
      count: number;
      marker: MapboxMarker<any>;
    }
  } = {};

  readonly layerId = 'defaultRoute';
  readonly sourceId = 'defaultRoute';

  @Input() center: number[];
  @Input() zoom: number;

  ruler = cheapRuler(44.4, 'meters');
  nativeMap: Map;

  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor() { }

  ngOnInit() {
    if (!this.center || !this.zoom) {
      throw Error('Center and zoom required');
    }

    this.nativeMap = new Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/light-v9',
      center: this.center,
      zoom: this.zoom
    });

    this.nativeMap.on('dragend', () => {
      this.dragend.next();
      this.centerChange.next(this.nativeMap.getCenter());
    });

    this.nativeMap.on('load', () => {
      this.mapReady.next();
      this.centerChange.next(this.nativeMap.getCenter());
    });
  }

  private getHashKey(marker: MapboxMarker<any> | { id: string } | FilmLocationSchema) {
    return (marker as { id: string }).id || (marker as MapboxMarker<any>).props.pointId;
  }

  private addMarker(marker: MapboxMarker<any>) {
    const key = this.getHashKey(marker);
    if (this.currentMarkersHash[key] === undefined) {
      this.currentMarkersHash[key] = {
        marker: marker.addToMap(this.nativeMap),
        count: 1
      };
    } else {
      ++this.currentMarkersHash[key].count;
    }
  }

  private getStraightPaint() {
    return {
      'line-offset': {
        property: 'offset-category',
        type: 'categorical',
        stops: [[1, 3]]
      },
      'line-width': 4,
      'line-color': '#942192'
    };
  }

  private getDottedPaint() {
    return {
      'line-offset': {
        property: 'offset-category',
        type: 'categorical',
        stops: [[1, 3], [5, 7]]
      },
      'line-width': 4,
      'line-color': '#942192',
      'line-dasharray': [1, 1]
    };
  }

  private getRouteLayer(id, sourceId, paint) {
    return <mapbox.Layer | any>{
      id: id,
      type: 'line',
      source: sourceId,
      filter: ['==', '$type', 'LineString'],
      layout: {
        'line-join': 'bevel',
        'line-cap': 'butt'
      },
      paint: paint
    };
  }

  private getLineStringFeature(params: { pointId: string; coordinates: number[][] }, offsetCategory) {
    return {
      type: 'Feature',
      properties: {
        'offset-category': offsetCategory
      },
      geometry: {
        id: params.pointId,
        type: 'LineString',
        coordinates: params.coordinates
      }
    };
  }

  fitBounds() {
    if (this.nativeMap === undefined) {
      return;
    }
    const positions = Object.keys(this.currentMarkersHash)
      .map(key => turf.feature({ type: 'Point', coordinates: this.currentMarkersHash[key].marker.props.position }));
    const bounds = turf.bbox(turf.featureCollection(positions)) as number[];
    this.nativeMap.fitBounds(bounds as any, {
      padding: 150,
      offset: [200, 0]
    });
  }

  drawRoutes(locations: (FilmLocationSchema & { routeCoordinates: number[][] })[]) {
    const routeLayer = this.getRouteLayer(this.layerId, this.sourceId, this.getStraightPaint());
    const layerData = {
      type: 'FeatureCollection',
      features: []
    } as any;

    locations.map((l, i) => {
      const marker = this.currentMarkersHash[this.getHashKey(l)].marker;

      marker.routeCoordinates = l.routeCoordinates;

      marker.setPointText((i + 1).toString());

      if (!marker.routeCoordinates) {
        return;
      }

      const featureToAdd = this.getLineStringFeature({ pointId: marker.props.pointId, coordinates: marker.routeCoordinates }, 1);
      layerData.features.push(featureToAdd);
      const tempLayer = this.nativeMap.getLayer(this.layerId);
      let tempSource = this.nativeMap.getSource(this.sourceId) as mapbox.GeoJSONSource;
      if (tempSource === undefined) {
        this.nativeMap.addSource(this.sourceId, {
          type: 'geojson',
          data: layerData
        });
        tempSource = this.nativeMap.getSource(this.sourceId) as mapbox.GeoJSONSource;
      }
      if (tempLayer === undefined) {
        this.nativeMap.addLayer(routeLayer);
      }
      tempSource.setData(layerData);
    });
  }

  removeRoutes() {
    if (this.nativeMap === undefined) {
      return;
    }
    if (this.nativeMap.getLayer(this.layerId) !== undefined) {
      this.nativeMap.removeLayer(this.layerId);
    }
    if (this.nativeMap.getSource(this.sourceId) !== undefined) {
      this.nativeMap.removeSource(this.sourceId);
    }
  }

  private runDownMarkers() {
    Object.keys(this.currentMarkersHash).forEach(key => {
      if (--this.currentMarkersHash[key].count === -1) {
        this.currentMarkersHash[key].marker.remove();
        delete this.currentMarkersHash[key];
      }
    });
  }

  addMarkers(markers: MapboxMarker<any>[]) {
    markers.forEach(m => {
      this.addMarker(m);
    });
  }

  removeAllMarkers() {
    this.runDownMarkers();
  }

  upsertMarkers(markers: MapboxMarker<any>[]) {
    markers.forEach(m => {
      this.addMarker(m);
    });
    this.runDownMarkers();
  }
}
