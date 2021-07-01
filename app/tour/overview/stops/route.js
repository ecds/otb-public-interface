import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TourOverviewStopsRoute extends Route {
  @service fastboot;

  // @enqueueTask
  // stopEnter = function*(tourStop) {
  //   yield timeout(300);
  //   const stop = this.store.peekRecord('stop', tourStop.get('stop.id'));
  //   stop.stop.setProperties({
  //     show: true
  //   });
  //   yield timeout(300);
  // };

  @action
  goToStop(stop) {
    this.transitionTo('tour.stop', stop);
  }

  // @action
  // didTransition() {
  //   if (this.fastboot.isFastBoot) return;
  //   console.log("🚀 ~ file: route.js ~ line 30 ~ TourOverviewStopsRoute ~ didTransition ~ this.modelFor('tour').sortedTourStops", this.modelFor('tour').sortedTourStops)
  //   this.modelFor('tour').sortedTourStops.forEach((tourStop) => {
  //     if (!tourStop.isDestroyed) {
  //       this.stopEnter.perform(tourStop);
  //     }
  //   });
  // }

  @action
  willTransition() {
    this.modelFor('tour').sortedTourStops.forEach((stop) => {
      if (!stop.isDestroyed) {
        stop.stop.setProperties({
          show: false
        });
      }
    });
  }

  @action
  gotToStop(stop) {
    this.transitionToRoute('stop', stop);
  }
}
