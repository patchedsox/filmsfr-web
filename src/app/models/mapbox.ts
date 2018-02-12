import { Marker, Popup, Map } from 'mapbox-gl';
import * as turf from '@turf/turf';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : ({} as any);
}

const markerColors = {
  GREEN: '#8ACC70',
  YELLOW: '#FF6363',
  RED: '#FCCD56',
  BLUE: '#698abf',
};

const markerColorsRgb = {
  GREEN: hexToRgb(markerColors.GREEN),
  YELLOW: hexToRgb(markerColors.GREEN),
  RED: hexToRgb(markerColors.GREEN),
  BLUE: hexToRgb(markerColors.BLUE),
};


export interface MapboxMarkerProperties<T> {
  data: T;
  position: number[];
  pointType: string;
  pointId: string;
  iconSvg?: 'waste-truck-circle.svg' | 'waste-truck.svg';
  nextPosition?: number[];
  nextPointId?: string;
  backgroundRgba?: { r: number; g: number; b: number; a?: string };
  popupText?: string;
  highlightType?: 'glow' | 'cover' | 'none';
  selected?: boolean;
  borderSize?: number;
  pointSize?: number;
  pointText?: string;
  highlightSize?: number;
}

const classByIcon = {
  'waste-truck.svg': 'waste-truck-marker',
  'waste-truck-circle.svg': 'waste-truck-circle-marker'
};

export class MapboxMarker<T> {
  private rgba: { r: number; g: number; b: number; a?: string };
  private el: SVGElement;
  private gWrapper: SVGGElement;
  private child: SVGCircleElement | SVGImageElement;
  private text: SVGTextElement;
  private marker: Marker;
  private popup: Popup;
  private highlighted = false;
  private addedToMap = false;
  private map: Map;
  private panToSelfWhenMapReady = false;

  public pendingRouteCalculation = true;
  public routeCoordinates: number[][];
  constructor(
    public props: MapboxMarkerProperties<T>,
    private selectHandler?: (props: MapboxMarkerProperties<T>) => any,
    private deselectHandler?: (props: MapboxMarkerProperties<T>) => any
  ) {
    const xmlNs = 'http://www.w3.org/2000/svg';

    this.el = document.createElementNS(xmlNs, 'svg') as SVGElement;
    this.gWrapper = document.createElementNS(xmlNs, 'g') as SVGGElement;
    this.gWrapper.setAttribute('class', 'map-g');
    this.el.appendChild(this.gWrapper);

    if (this.props.iconSvg === undefined) {
      this.child = document.createElementNS(xmlNs, 'circle') as SVGCircleElement;
    } else {
      this.child = document.createElementNS(xmlNs, 'image') as SVGImageElement;
    }

    this.text = document.createElementNS(xmlNs, 'text') as SVGTextElement;
    this.gWrapper.appendChild(this.child);
    this.gWrapper.appendChild(this.text);

    this.setStyle();

    this.marker = new Marker(this.el as any).setLngLat(this.props.position);

    if (this.props.selected) {
      this.select();
    }
    if (this.props.popupText) {
      this.enablePopup();
    }
  }

  public setPointText(text: string) {
    if (text !== undefined) {
      this.props.pointText = text;
      this.text.innerHTML = text;
    }
  }

  public panToSelf() {
    if (!this.map) {
      this.panToSelfWhenMapReady = true;
    } else {
      this.panToSelfInternal();
    }
    return this;
  }

  private panToSelfInternal() {
    this.map.flyTo({
      zoom: 18,
      center: this.props.position
    });
    return this;
  }

  public setPosition(newPosition: number[]) {
    const point1 = turf.point(this.props.position);
    const point2 = turf.point(newPosition);
    const bearing = turf.bearing(point1, point2);
    if (bearing >= 0) {
      this.gWrapper.style.transform = `rotate(${bearing}deg) rotateY(180deg)`;
    } else {
      this.gWrapper.style.transform = `rotate(${bearing}deg)`;
    }
    this.props.position = newPosition;
    this.marker.setLngLat(newPosition);
  }
  private setStyle() {
    this.rgba = this.props.backgroundRgba || markerColorsRgb.BLUE;
    this.rgba.a = '0.2';
    const hW = this.props.pointSize || 20;
    const bS = this.props.borderSize === undefined ? 2 : this.props.borderSize;
    const c = (hW + bS) / 2;
    const r = hW / 2;

    this.el.setAttribute('height', (hW + bS).toString());
    this.el.setAttribute('width', (hW + bS).toString());
    this.el.setAttribute('class', 'map-svg');
    this.el.setAttribute('cx', c.toString());
    this.el.setAttribute('cy', c.toString());

    if (this.props.iconSvg === undefined) {
      this.child.setAttribute('class', 'map-svg-circle');
      this.child.setAttribute('cx', c.toString());
      this.child.setAttribute('cy', c.toString());
      this.child.setAttribute('r', r.toString());
      this.child.style.strokeWidth = bS.toString();
      this.child.setAttribute('fill', `rgb(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b})`);
    } else {
      this.child.setAttribute('class', 'map-svg-image ' + classByIcon[this.props.iconSvg]);
      this.child.setAttribute('href', 'assets/icons/' + this.props.iconSvg);
      this.child.setAttribute('width', (2 * c).toString());
      this.child.setAttribute('height', (2 * c).toString());
    }

    this.text.setAttribute('x', c.toString());
    this.text.setAttribute('y', c.toString());
    this.text.setAttribute('text-anchor', 'middle');
    this.text.setAttribute('fill', '#ffffff');
    this.text.setAttribute('dy', '.4em');
    this.text.style.cursor = 'pointer';
    this.setPointText(this.props.pointText);
  }
  update(props: MapboxMarkerProperties<T>) {
    this.props = props;
    this.setStyle();
    if (this.popup) {
      this.popup.setText(`${this.props.popupText}`);
    }
  }
  enablePopup() {
    if (this.child.onmouseover && this.child.onmouseout) {
      return;
    }
    if (this.props.popupText) {
      this.popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom'
      });

      this.popup.setText(`${this.props.popupText}`);

      this.marker.setPopup(this.popup);

      this.child.onmouseover = ev => {
        if (!this.popup.isOpen()) {
          this.marker.togglePopup();
        }
      };

      this.child.onmouseout = ev => {
        if (this.popup.isOpen()) {
          this.marker.togglePopup();
        }
      };
    }
  }
  disablePopup() {
    this.child.onmouseover = undefined;
    this.child.onmouseout = undefined;
    this.popup.remove();
  }
  enableClickToSelect(
    selectHandler: (props: MapboxMarkerProperties<T>) => any,
    deselectHandler: (props: MapboxMarkerProperties<T>) => any
  ) {
    this.selectHandler = selectHandler;
    this.deselectHandler = deselectHandler;
    if (this.child.onclick) {
      return;
    }
    this.child.onclick = ev => {
      if (this.props.selected) {
        this.deselect();
      } else {
        this.select();
      }
    };
  }
  disableClickToSelect() {
    this.deselect();
    this.selectHandler = undefined;
    this.deselectHandler = undefined;
    this.child.onclick = undefined;
  }
  remove() {
    this.marker.remove();
  }
  addToMap(map: Map) {
    if (this.addedToMap) {
      this.remove();
    }
    this.addedToMap = true;
    this.marker.addTo(map);
    this.map = map;
    if (this.panToSelfWhenMapReady) {
      this.panToSelfInternal();
    }
    return this;
  }
  _highlight() {
    if (this.props.highlightType === 'none') {
      return;
    }
    if (this.highlighted) {
      return;
    }
    if (this.props.highlightType === 'glow') {
      this.el.style.boxShadow = `0px 0px ${this.props.highlightSize || 10}px 4px rgb(${this.rgba.r - 40}, ${this.rgba.g - 40}, ${this.rgba
        .b - 40})`;
    } else {
      this.el.style.boxShadow = `0px 0px 0px ${this.props.highlightSize || 50}px rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, ${
        this.rgba.a
        })`;
    }
    this.el.style.zIndex = '2';
    this.highlighted = true;
  }
  select() {
    this._highlight();
    if (this.props.selected) {
      return;
    }
    this.props.selected = true;
    this.selectHandler(this.props);
  }
  _turnOff() {
    if (!this.highlighted) {
      return;
    }
    this.el.style.zIndex = 'unset';
    this.el.style.boxShadow = 'unset';
    this.highlighted = false;
  }
  deselect() {
    this._turnOff();
    if (!this.props.selected) {
      return;
    }
    this.props.selected = false;
    this.deselectHandler(this.props);
  }
}
