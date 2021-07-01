import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { dropTask, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class LocationService extends Service {
  @service fastboot;

  @tracked clientLocation = null;
  watcherId = null;
  @tracked errorMessage = null;

  notAllowed = true;

  get geoOptions() {
    return {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 30000
    };
  }

  @dropTask
  updateLocation = function*(location) {
    if (this.notAllowed || this.isFastBoot) return false;
    if (this.clientLocation && this.clientLocation.lat == location.coords.latitude && this.clientLocation.lng == location.coords.longitude) return;
    this.clientLocation = {
      lat: location.coords.latitude,
      lng: location.coords.longitude
    };
    this.errorMessage = null;
    yield timeout(5000);
  }

  // TODO: make this a task so we can let people know it is trying
  @dropTask
  *getLocation() {
    if (this.notAllowed || this.fastboot.isFastBoot) return;
    yield timeout(300);
    navigator.geolocation.getCurrentPosition(
      location => {
        this.updateLocation.perform(location, true);
        this.cleared = false;
        return location;
      }, error => {
        this.errorMessage = error.message;
        this.getLocation.perform();
      },
      this.geoOptions
    );
  }

  @dropTask
  *startLocationWatcher() {
    // TODO handel notSupported
    if (this.fastboot.isFastBoot) return false;
    yield timeout(300);
    if (this.watcherId) return;
    if (!('geolocation' in navigator)) return this.notSupported();
    if (!this.watcherId) {
      this.watcherId = navigator.geolocation.watchPosition(
        location => {
          this.updateLocation.perform(location);
        }, error => {
          this.errorMessage = error.message;
        },
        this.geoOptions
      );
    }
  }

  stopLocationWatcher() {
    if (!this.watcherId) return;
    navigator.geolocation.clearWatch(this.watcherId);
    this.watcherId = null;
  }
}
