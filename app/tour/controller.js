import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import MapUtil from '../utils/google-maps';
import { tracked } from '@glimmer/tracking';
import ENV from '../config/environment';
export default class TourController extends Controller {
  @service deviceContext;
  @service router;
  @service store;
  @service tenant;
  @service theme;

  @tracked
  activeStop = null;

  @tracked
  menuOpen = false;

  showStopGrid = false;

  mapUtil = MapUtil.create();

  env = ENV;

  @action
  toggleStopGrid(value) {
    this.set('showStopGrid', value);
  }

  @dropTask
  *setActiveStop(tourStop, scrollTo=false) {
    this.activeStop = null;
    const stops = this.store.peekAll('stop');

    yield stops.forEach(tourStop => {
      if (tourStop && !tourStop._internalModel.currentState.isLoading) {
        tourStop.setProperties({ active: false });
      }
    });

    if (!tourStop) {
      return this.router.transitionTo('tour.overview', this.model.slug);
    }

    if (tourStop.promise) {
      tourStop = this.store.peekRecord('tourStop', tourStop.get('id'));
    }

    const stop = yield this.store.peekRecord('stop', tourStop.get('stop.id'));

    stop.setProperties({ active: true });
    this.activeStop = stop;

    // if (tourStop) {
    //   this.router.transitionTo('tour.stop.index', stop.slug);
    // }

    yield timeout(1500);

    if (!this.deviceContext.isDesktop) return;

    if (scrollTo) {
      const stopEl = document.getElementById(
        `${stop.slug}-${stop.id}`
      );
      stopEl.firstElementChild.scrollIntoView();
      window.scrollBy(0, -80);
    }
    yield timeout(300);
  }
}
