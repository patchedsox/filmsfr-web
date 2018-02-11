import { Injectable } from '@angular/core';
import * as turf from '@turf/turf';
import { Point } from '@turf/turf';
import { LngLat } from 'mapbox-gl';

@Injectable()
export class GeoHelpers {
  getBoundsOfCircle(center: LngLat, radius: number) {
    const bbox = turf.bbox(turf.circle(turf.point([center.lng, center.lat]), radius));
    const bounds = {
      west: bbox[0],
      south: bbox[1],
      east: bbox[2],
      north: bbox[3],
    };

    return bounds;
  }
  getBoundsOfPoints(points: LngLat[]) {
    const tPoints = points.map(c => <Point>{
      type: 'Point',
      coordinates: [c.lng, c.lat]
    });
    const bbox = turf.bbox(turf.geometryCollection(tPoints));
    const bounds = {
      west: bbox[0],
      south: bbox[1],
      east: bbox[2],
      north: bbox[3],
    };

    return bounds;
  }
}
