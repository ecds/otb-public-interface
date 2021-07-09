import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
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

  @restartableTask
  setActiveStop = function*(stops, stop, scrollTo=false) {
    if (stop.promise) {
      stop = this.store.peekRecord('stop', stop.get('id'));
    }
    yield timeout(500);
    if (!this.deviceContext.isDesktop) return;

    if (scrollTo) {
      const stopEl = document.getElementById(
        `${stop.get('stop.slug')}-${stop.get('stop.id')}`
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
