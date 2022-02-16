import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class OverviewMapComponent extends Component {
  @service deviceContext;
  @service store;

  @tracked
  zoomLevel = 16;

  @tracked
  show = false;

  @action
  markerClicked(tourStop) {
    tourStop = this.store.peekRecord('tour-stop', tourStop.id);
    if (this.deviceContext.isDesktop) {
      this.args.setActiveStop.perform(tourStop, true);
    } else {
      this.args.tour.get('stops').forEach(stop => {
        stop.setProperties({ showOverviewInfoWindow: false });
      });
      tourStop.setProperties({ showOverviewInfoWindow: true });
    }
  }

  @action
  fitBounds(event){
    event.map.fitBounds(this.args.tour.latLngBounds);
    this.zoomLevel = event.map.getZoom();
    if (!this.args.tour.mapOverlay.content) {
      this.show = true;
    }
  }

  @action
  overlayAdded() {
    this.show = true;
  }
}
