import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OverviewMapComponent extends Component {
  @service deviceContext;

  @action
  markerClicked(stop) {
    if (this.deviceContext.isDesktop) {
      this.args.setActiveStop.perform(null, stop, false);
    } else {
      this.args.tour.get('stops').forEach(stop => {
        stop.setProperties({ showOverviewInfoWindow: false });
      });
      stop.setProperties({ showOverviewInfoWindow: true });
    }
  }

  @action
  fitBounds(event){
    event.map.fitBounds(this.args.tour.latLngBounds);
  }
}
