import Model, { hasMany, belongsTo, attr } from '@ember-data/model';
import { htmlSafe } from '@ember/string';
// import ENV from '../config/environment';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class TourModel extends Model {
  @service cookies;
  @service location;
  @service maps;
  @service store;

  @attr('string') title;
  @attr('string') slug;
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
  @attr('string', {
    defaultValue() { return 'hybrid'; }
  }) mapType;

  @attr() bounds;
  @belongsTo('mapOverlay') mapOverlay;

  @attr('string', { defaultValue: '/assets/images/otb-bg.png' }) splashUrl;

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
    return `/${this.tenant}`;
  }

  get cookiesAllowedCookie() {
    return 'openTour';
  }

  get cookiesAllowed() {
    if (this.cookies.read(this.cookiesAllowedCookie) == 'yup') {
      return true;
    } else {
      this.setProperties({ locationAllowed: false });
    }
    return false;
  }

  set cookiesAllowed(allowed) {
    if (allowed) {
      this.cookies.write(this.cookiesAllowedCookie, 'yup');
    } else {
      this.cookies.clear(this.cookiesAllowedCookie);
      this.setProperties({ locationAllowed: false });
    }
    return allowed;
  }

  get locationAllowedCookie() {
    return `${this.slug}-${this.id}-location-allowed`;
  }

  get locationAllowed() {
    if (this.cookies.read(this.locationAllowedCookie) == 'yup') {
      this.location.notAllowed = false;
      this.location.getLocation.perform();
      return true;
    } else {
      this.location.notAllowed = true;
      this.location.clientLocation = null;
      return false;
    }
  }

  set locationAllowed(allowed) {
    // For some reason, the map controls do not go way when this is toggled.
    // This forces the whole map to be removed and re-added.
    this.redrawMap.perform();
    if (allowed) {
      this.cookies.write(this.locationAllowedCookie, 'yup');
    } else {
      this.location.locationAllowed = false;
      this.cookies.clear(this.locationAllowedCookie);
      this.setProperties({ updateLocationAllowed: false });
    }
    return allowed;
  }

  @task
  *redrawMap() {
    this.setProperties({ redrawingMap: true });
    yield timeout(300);
    this.setProperties({ redrawingMap: false });
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
      this.cookies.write(this.updateLocationAllowedCookie, 'yup');
      this.setProperties({ locationAllowed: true });
    } else {
      this.cookies.clear(this.updateLocationAllowedCookie);
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
    this.cookies.write(this.modeCookieName, mode.get('id'), { path: `/${this.tenant}/${this.slug}` });
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
