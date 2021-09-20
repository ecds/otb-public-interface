import Directions from 'ember-google-maps/components/g-map/directions';
import { keepLatestTask } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { modal } from 'uikit';
import { inject as service } from '@ember/service';

export default class DirectionsComponent extends Directions {
  @service maps;

  @keepLatestTask
  @waitFor
  *fetchDirections(options = {}) {
    let directionsService = yield this.googleMapsApi.directionsService;

    let request = new Promise((resolve, reject) => {
      directionsService.route(options, (response, status) => {
        if (status === 'OK') {
          resolve(response);
        } else {
          switch(status) {
            case 'NOT_FOUND':
              this.maps.directionsError = 'The location was not found.';
              break;
            case 'ZERO_RESULTS':
            case 'MAX_ROUTE_LENGTH_EXCEEDED':
              this.maps.directionsError = `No ${options.travelMode} route could be found to the stop. Try a different mode.`;
              break;
            case 'MAX_WAYPOINTS_EXCEEDED':
              this.maps.directionsError = 'Too many stops between here and your destination.';
              break;
            case 'INVALID_REQUEST':
              this.maps.directionsError = 'Something is wrong with the location of this stop.';
              break;
            case 'OVER_QUERY_LIMIT':
              this.maps.directionsError = 'This is a popular tour and we have reached the limit allowed by Google. Please try again later.';
              break;
            case 'REQUEST_DENIED':
              this.maps.directionsError = 'This tour does not have permission to access the Google\'s directions service. Someone needs to check the API key.';
              break;
            case 'UNKNOWN_ERROR':
            default:
              this.maps.directionsError = 'Getting directions failed and we did not get a reason. Please try again.';
            }

          modal.alert(this.maps.directionsError);
          reject(status);
        }
      });
    });

    this.directions = yield request;
    this.events.onDirectionsChanged?.(this.publicAPI);

    return this.directions;
  }
}
