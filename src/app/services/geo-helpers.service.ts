import { Injectable } from '@angular/core';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';
import * as turf from '@turf/turf';
import { Point } from '@turf/turf';

@Injectable()
export class GeoHelpers {
  getBoundsOfCircle(center: LatLngLiteral, radius: number) {
    const bbox = turf.bbox(turf.circle(turf.point([center.lng, center.lat]), radius));
    const bounds = {
      west: bbox[0],
      south: bbox[1],
      east: bbox[2],
      north: bbox[3],
    };

    return bounds;
  }
  getBoundsOfPoints(points: LatLngLiteral[]) {
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
