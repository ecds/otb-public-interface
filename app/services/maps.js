import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MapsService extends Service {
  @service fastboot;
  @service googleMapsApi;

  @tracked
  directions = null;

  @tracked
  directionsError = null;

  directionsRenderer = null;
  panel = null;

    constructor() {
      super(...arguments);
      if (this.fastboot.isFastBoot) return null;
      this.setUpGoogle();
    }

  async setUpGoogle() {
    if (this.fastboot.isFastBoot) return;
    this.google = await this.googleMapsApi.google;
    this.directionsRenderer = new this.google.maps.DirectionsRenderer();
  }

  showDirections(response) {
    this.panel = document.getElementById('directions-panel');
    if (this.fastboot.isFastBoot) return null;
    this.directionsRenderer.setDirections(response.directions);
    this.directionsRenderer.setPanel(this.panel);
  }
}
