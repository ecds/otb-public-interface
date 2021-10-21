import Model, { hasMany, belongsTo, attr } from '@ember-data/model';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
/* global google */

export default class TourModel extends Model {
  @service cookies;
  @service location;
  @service maps;
  @service store;
  @service('tenant') tenantService;

  @attr('string') title;
  @attr('string') slug;
  @attr('string') estTime;
  @attr('string', {
    defaultValue() { return ''; }
  }) description;
  @attr('string') sanitizedDescription;
  @attr('string') metaDescription;
  @attr('string') sanitizedDirectionNotes;
  @attr('string') video;
  @attr('number') position;
  @attr('number') stopCount;
  @attr('string') theme_title;
  @attr() splash;
  @attr('string') insecureSplash;
  @attr('string') externalUrl;
  @attr('string') linkAddress;
  @attr('string') linkText;
  @hasMany('mode') modes;
  @belongsTo('mode', {
    async: true,
    inverse: null
  }) mode;
  @attr('string') title;
  @attr('string') tenantTitle;
  @attr('string') tenant;
  @attr('string') defaultLng;
  @attr('boolean') useDirections;
  @attr('boolean', { defaultValue: false }) redrawingMap;
  @hasMany('tour_stop') tourStops;
  @hasMany('stop') stops;
  @hasMany('flat-page') flatPages;
  @hasMany('tour-flat-page') tourFlatPages;
  @hasMany('medium') media;
  @hasMany('tour-medium') tourMedia;
  @attr('number') splashHeight;
  @attr('number') splashWidth;
  @attr('string', { defaultValue: 'hybrid' }) mapType;

  @attr() gMap;
  @attr() bounds;
  @belongsTo('mapOverlay') mapOverlay;

  get oneYearFromNow() {
    return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  }

  get hasMedia() {
    return this.sortedMedia.length > 0;
  }

  get splashUrl() {
    if (this.splash) {
      return this.splash.url;
    }
    return '/assets/images/otblogo.png';
  }

  get latLngBounds() {
    return {
      south: this.bounds.south,
      west: this.bounds.west,
      north: this.bounds.north,
      east: this.bounds.east
    };
  }

  get splashBackground() {
    return new htmlSafe(
      `background: url(${this.splashUrl}); background-size: cover;`
    );
  }

  get safeDescription() {
    return new htmlSafe(
      this.get('description')
    );
  }

  get cookiePath() {
    if (this.tenantService.isSubDomain) {
      return `/${this.slug}`;
    }
    return `/${this.tenant}/${this.slug}`;
  }

  get cookiesAllowedCookie() {
    return 'openTour';
  }

  get cookiesAllowed() {
    if (this.cookies.read(this.cookiesAllowedCookie) == 'yup') {
      return true;
    }
    return false;
  }

  set cookiesAllowed(allowed) {
    if (allowed) {
      this.cookies.write(this.cookiesAllowedCookie, 'yup', { expires: this.oneYearFromNow, path: this.cookiePath });
    } else {
      this.cookies.write(this.cookiesAllowedCookie, 'nope', { expires: new Date(), path: this.cookiePath });
      this.cookies.clear(this.cookiesAllowedCookie, { path: this.cookiePath });
      this.setProperties({ locationAllowed: false });
    }
    return allowed;
  }

  get locationAllowedCookie() {
    return `${this.slug}-${this.id}-location-allowed`;
  }

  get locationAllowed() {
    if (!this.cookiesAllowed) {
      return false;
    }
    if (this.cookies.read(this.locationAllowedCookie) == 'yup') {
      this.location.notAllowed = false;
      this.location.getLocation.perform();
      return true;
    } else {
      this.location.notAllowed = true;
      this.location.clientLocation = null;
      if (this.gMap) {
        this.gMap.controls[google.maps.ControlPosition.TOP_LEFT].clear();
        this.gMap.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
      }
      return false;
    }
  }

  set locationAllowed(allowed) {
    if (allowed) {
      this.cookies.write(this.locationAllowedCookie, 'yup', { expires: this.oneYearFromNow, path: this.cookiePath });
    } else {
      this.location.locationAllowed = false;
      this.cookies.write(this.locationAllowedCookie, 'nope', { expires: new Date(), path: this.cookiePath });
      this.cookies.clear(this.locationAllowedCookie, { path: this.cookiePath });
      this.setProperties({ updateLocationAllowed: false });
    }
  }

  get updateLocationAllowedCookie() {
    return `${this.slug}-${this.id}-update-location-allowed`;
  }

  get updateLocationAllowed() {
    if (this.cookies.read(this.updateLocationAllowedCookie) == 'yup') {
      if (!this.location.watcherId) {
        this.location.startLocationWatcher.perform();
      }
      return true;
    }
    if (this.location.watcherId) {
      this.location.stopLocationWatcher();
      this.location.watcherId = null;
    }
    return false;
  }

  set updateLocationAllowed(allowed) {
    if (allowed) {
      this.cookies.write(this.updateLocationAllowedCookie, 'yup', { expires: this.oneYearFromNow, path: this.cookiePath });
      this.setProperties({ locationAllowed: true });
    } else {
      this.cookies.write(this.updateLocationAllowedCookie, 'nope', { expires: new Date(), path: this.cookiePath });
      this.cookies.clear(this.updateLocationAllowedCookie, { path: this.cookiePath });
    }
    return allowed;
  }

  get modeCookieName() {
    return `${this.slug}-${this.id}-travel-mode`;
  }

  get currentMode() {
    const fromCookie = this.cookies.read(this.modeCookieName);
    if (fromCookie) {
      return this.store.peekRecord('mode', fromCookie);
    }
    return this.mode;
  }

  set currentMode(mode) {
    this.cookies.write(this.modeCookieName, mode.get('id'), { path: this.cookiePath });
    return mode;
  }

  get sortedTourStops() {
    return this.tourStops.sortBy('position');
  }

  get sortedMedia() {
    this.stops;
    return this.tourMedia.sortBy('position');
  }

  get sortedFlatPages() {
    return this.tourFlatPages.sortBy('position');
  }
}
