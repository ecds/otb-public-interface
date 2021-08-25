import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TourStopIndexRoute extends Route {
  @service router;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      const container = document.getElementById('otb-mobile-tour-stop-container');
      if (container) container.scrollTop = 0;
    });
  }
}
