import Component from '@glimmer/component';
import { enqueueTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MobileStopListComponent extends Component {
  @service router;
  @service store;

  @action
  gotToStop(stopSlug) {
    this.router.transitionTo('tour.stop', stopSlug);
  }

  @action
  showStops() {
    this.args.sortedTourStops.forEach(sortedStop => {
      const stopId = sortedStop.get('stop.id');
      this.showStop.perform(this.store.peekRecord('stop', stopId), stopId);
    });
  }

  @enqueueTask
  *showStop(stop, stopId) {
    if (!stop) {
      stop = yield this.store.findRecord('stop', stopId);
    }
    stop.setProperties({ show: true });
    yield timeout(300);
  }
}
