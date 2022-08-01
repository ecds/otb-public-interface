import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import UIkit from 'uikit';
import { task, timeout } from 'ember-concurrency';

export default class TourFlatPageRoute extends Route {
  @service deviceContext;
  @service fastboot;
  @service store;

  model(params) {
    return this.store.findRecord('flat-page', params.page_id );
  }

  afterModel(model) {
    if (this.deviceContext.isDesktop && !this.fastboot.isFastBoot) {
      this.showPage.perform(model.id);
    }
  }

  @task
  *showPage(page) {
    yield timeout(300);
    const element = document.getElementById(`flat-page-${page}`);
    if (element) {
      UIkit.offcanvas(`#flat-page-${page}`).show();
    } else {
      this.showPage.perform(page);
    }
  }
}
