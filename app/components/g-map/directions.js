import Directions from 'ember-google-maps/components/g-map/directions';
import { keepLatestTask } from 'ember-concurrency';

export default class DirectionsComponent extends Directions {
  defaultErrorMesg = 'Getting directions failed and we did not get a reason. Please try again.';

  @keepLatestTask
  *fetchDirections(options = {}) {
    let directionsService = yield this.googleMapsApi.directionsService;

    try {
      let request = directionsService.route(options);
      let response = yield request;
      return response;
    } catch(error) {
      let errorMesg = null;
      switch(error.code) {
        case 'NOT_FOUND':
          errorMesg = 'The location was not found.';
          break;
        case 'ZERO_RESULTS':
        case 'MAX_ROUTE_LENGTH_EXCEEDED':
          errorMesg = `No ${options.travelMode} route could be found to the stop. Try a different mode.`;
          break;
        case 'MAX_WAYPOINTS_EXCEEDED':
          errorMesg = 'Too many stops between here and your destination.';
          break;
        case 'INVALID_REQUEST':
          errorMesg = 'Something is wrong with the location of this stop.';
          break;
        case 'OVER_QUERY_LIMIT':
          errorMesg = 'This is a popular tour and we have reached the limit allowed by Google. Please try again later.';
          break;
        case 'REQUEST_DENIED':
          errorMesg = 'This tour does not have permission to access the Google\'s directions service. Someone needs to check the API key.';
          break;
        case 'UNKNOWN_ERROR':
        default:
          errorMesg = this.defaultErrorMesg;
        }

      return { error: errorMesg };
    }
  }
}
