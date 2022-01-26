import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TourFlatPageRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('flat-page', params.page_id );
  }
}
