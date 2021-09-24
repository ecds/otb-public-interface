import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';
import { tracked } from '@glimmer/tracking';
export default class MobileStopMapComponent extends Component {
  @service fastboot;
  @service maps;
  @service location;
  @service store;

  @tracked
  showDirectionsPanel = false;

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
  cancelDirections() {
    this.args.tour.setProperties({ locationAllowed: false });
  }

  @action
  mapLoaded(event) {
    this.args.tour.setProperties({ gMap: event.map });
  }

  willDestroy() {
    this.args.tour.setProperties({ gMap: null });
  }

}
