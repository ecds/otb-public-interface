import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OverviewMapComponent extends Component {
  @service deviceContext;
  @service store;

  @tracked
  zoomLevel = 16;

  @action
  markerClicked(stop) {
    stop = this.store.peekRecord('stop', stop.id);
    if (this.deviceContext.isDesktop) {
      this.args.setActiveStop.perform(stop, true);
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
    this.zoomLevel = event.map.getZoom();
  }
}
