import EmberRouter from "@ember/routing/router";
import ENV from "./config/environment";
import { inject as service } from '@ember/service';

let tenant = null;

const Router = EmberRouter.extend({
  fastboot: service(),
  tenant: service(),
  location: ENV.locationType,
  rootURL: '/',
  init() {
    this._super(...arguments);
    tenant = this.tenant;
  }
});

Router.map(function() {
  if (ENV.APP.TENANT) {
    this.route('tours');
    this.route('tour', {
     path: ':tour_slug'
    }, function() {
      this.route('stop', {
        path: ':stop_slug'
      }, function() {
        this.route('map');
      });
      this.route('flat-page', {
        path: 'page/:page_id'
      });
      this.route('overview', {
        path: '/'
      }, function() {
        this.route('map');
        this.route('stops');
      });
    });
  } else {
    this.route('tours', {
      path: tenant.isSubDomain ? '/tours' : ':tenant/'
    });
    this.route('tour', {
     path: tenant.isSubDomain ? ':tour_slug' : ':tenant/:tour_slug'
    }, function() {
      this.route('stop', {
        path: ':stop_slug'
      }, function() {
        this.route('map');
      });
      this.route('flat-page', {
        path: 'page/:page_id'
      });
      this.route('overview', {
        path: '/'
      }, function() {
        this.route('map');
        this.route('stops');
      });
    });
  }
});

export default Router;