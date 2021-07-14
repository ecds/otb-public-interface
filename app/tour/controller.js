import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import MapUtil from '../utils/google-maps';
import { tracked } from '@glimmer/tracking';

export default class TourController extends Controller {
  @service deviceContext;
  @service store;
  @service tenant;
  @service theme;

  @tracked
  menuOpen = false;

  showStopGrid = false;

  mapUtil = MapUtil.create();

  @action
  toggleStopGrid(value) {
    this.set('showStopGrid', value);
  }

  @dropTask
  setActiveStop = function*(tourStop, scrollTo=false) {
    const stops = this.store.peekAll('stop');

    yield stops.forEach(tourStop => {
      tourStop.setProperties({ active: false });
    });

    if (!tourStop) return;

    if (tourStop.promise) {
      tourStop = this.store.peekRecord('tourStop', tourStop.get('id'));
    }

    const stop = yield this.store.peekRecord('stop', tourStop.get('stop.id'));

    stop.setProperties({ active: true });

    yield timeout(500);

    if (!this.deviceContext.isDesktop) return;

    if (scrollTo) {
      const stopEl = document.getElementById(
        `${stop.slug}-${stop.id}`
      );
      stopEl.firstElementChild.scrollIntoView();
      window.scrollBy(0, -80);
    }
    // if (stop) {
    //   this.transitionToRoute('tour.stop', stop.slug);
    // } else {
    //   this.transitionToRoute('tour', this.model.slug);
    // }
    yield timeout(300);
  };
}
