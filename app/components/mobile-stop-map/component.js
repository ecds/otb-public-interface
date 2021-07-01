import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import { tracked } from '@glimmer/tracking';
export default class MobileStopMapComponent extends Component {
  @service fastboot;
  @service maps;
  @service location;
  @service store;

  @tracked
  showDirections = false;

  @tracked
  directionsError = null;

  get hasDirectionsError() {
    return typeof this.directionsError == 'string';
  }

  @action
  setDirections(directions) {
    if (directions.directions.error) {
      this.directionsError = directions.directions.error;
    } else {
      this.directionsError = null;
      this.args.stop.setProperties({ travelDirections: directions.directions });
      this.maps.showDirections(directions);
    }
  }

  get destination() {
    return {
      lat: this.args.stop.get('lat'),
      lng: this.args.stop.get('lng')
    };
  }

  @action
  infoWindowOpened(stopId, type='stop') {
    const stop = this.store.peekRecord('stop', stopId);
    if (type == 'parking') {
      stop.setProperties({ showInfoWindow: false });
    } else {
      stop.setProperties({ showParkingInfoWindow: false });
    }
  }

  @action
  infoWindowClosed(stopId, type='stop') {
    const stop = this.store.peekRecord('stop', stopId);
    if (type == 'parking') {
      stop.setProperties({ showParkingInfoWindow: false });
    } else {
      stop.setProperties({ showInfoWindow: false });
    }
  }

  @action
  createMap() {
  //   if (!google) return;

  //   const center = this.args.stop.getProperties(['lat', 'lng']);
  //   const mapOptions = {
  //     center: {lat: this.args.stop.get('lat'), lng: this.args.stop.get('lng')},
  //     mapTypeId: this.args.tour.mapType
  //   }
  //   let map = this.maps.map;
  //   if (map) {
  //     this.mapUtil.clearFeatures(this.maps.features, this.maps.map);
  //   }

  //   map = this.mapUtil.createMap(mapOptions);
  //   this.maps.set('map', map);

  //   const stopMarker = this.mapUtil.addMarker(map, center, false, this.args.stop);
  //   this.maps.features.push(stopMarker);

  //   if (this.args.stop.get('address')) {
  //     this.mapUtil.addInfoWindow(this.args.stop.get('address'), stopMarker, map);
  //   }


  //   const parkingCords = this.args.stop.getProperties(['parkingLat', 'parkingLng']);
  //   if (parkingCords.parkingLat && parkingCords.parkingLng) {
  //     const parkingMarker = this.mapUtil.addMarker(
  //       map,
  //       {
  //         lat: parkingCords.parkingLat,
  //         lng: parkingCords.parkingLng
  //       },
  //       true
  //     );
  //     this.maps.features.push(parkingMarker);
  //   }
  }

}
