import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default class Application extends JSONAPIAdapter {
  @service fastboot;
  @service tenant;

  get host() {
    return `${ENV.APP.API_HOST}/${this.tenant.currentTenant}`;
  }

  ajaxOptions(/*defaultOptions, adapter*/) {
    const options = super.ajaxOptions(...arguments);

    if (!this.fastboot.isFastBoot) {
      options.credentials = 'include';
      // Because this app still has jQuery (required by liquid fire), the
      // ajax requests are jQuery, not fetch :(
      options.xhrFields = {
        withCredentials: true
     };
    }

    return options;
  }
}
