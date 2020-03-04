import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
// import ENV from '../config/environment';

/**
 * Route to display all pubic tours for a site.
 *
 * @export
 * @class IndexRoute
 * @extends {Route}
 */
export default class ToursRoute extends Route {
  @service fastboot;
  @service tenant;
  /**
   * 
   *
   * @returns List of tours
   * @memberof IndexRoute
   */
  model() {
    return this.store.findAll('tour');
  }

  afterModel(model) {
    if (model.length == 1) {
      this.transitionTo('tour.overview', this.tenant.currentTenant, model.firstObject.slug);
    }
  }

  // /**
  //  * Redirect for sites that are hosted on an external address
  //  *
  //  * @param {*} model
  //  * @memberof IndexRoute
  //  */
  // redirect(model) {
  //   if (this.fastboot.isFastBoot) return;
  //   const currentLoc = `${window.location.hostname}:${window.location.port}`;
  //   const externalUrl = model.firstObject.external_url;
  //   if (externalUrl && ENV.APP.TENANT && currentLoc !== externalUrl) {
  //     window.location.replace(`http://${externalUrl}`);
  //   }
  // }
}
