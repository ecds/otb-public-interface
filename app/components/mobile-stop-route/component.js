import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import MapUtil from '../../utils/google-maps';

export default class MobileStopRouteComponent extends Component {
  @service location;
  // @service maps;

  mapUtil = MapUtil.create();

  directionsService = this.mapUtil.directionsService();
  directionsDisplay = this.mapUtil.directionsDisplay();

  setDirections(response) {
    console.log("🚀 ~ file: component.js ~ line 16 ~ MobileStopRouteComponent ~ setDirections ~ response", response)
    this.directionsDisplay.setDirections(response);
    this.directionsDisplay.setMap(this.maps.map);
    this.maps.set('route', this.directionsDisplay);
  }

  @action
  drawRoute() {
    this.mapUtil.clearFeatures(this.maps.features);
    let cords = this.args.stop.getProperties(['lat', 'lng', 'parkingLat', 'parkingLng']);
    this.maps.set('destination', {lat: cords.lat, lng: cords.lng});
    if (cords.parkingLat && cords.parkingLng) {
      this.maps.set('waypoints', [
        {
          location: { lat: cords.parkingLat, lng: cords.parkingLng },
          stopover: true
        }
      ]);
    }
    this.maps.calcRoute();
  }
}
