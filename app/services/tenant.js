import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask, timeout } from 'ember-concurrency';
import ENV from '../config/environment';

export default class TenantService extends Service {
  @service fastboot;
  @service store;

  @tracked
  tenantModel = null;

  @tracked
  isSubDomain = true;

  tenantPath = 'public'

  constructor() {
    super(...arguments);
    this.currentTenant;
  }

  get currentTenant() {
    if (ENV.APP.TENANT) {
      this.tenantPath = ENV.APP.TENANT;
    }
    else if (this.fastboot.isFastBoot) {
      if (this.fastboot.request.host == ENV.APP.HOST) {
        this.isSubDomain = false;
        this.tenantPath = this.fastboot.request.path.split('/')[1];
      } else {
        this.tenantPath = this.fastboot.request.host.split('.')[0];
      }
    } else {
      if (window.location.host == ENV.APP.HOST) {
        this.isSubDomain = false;
        this.tenantPath = window.location.pathname.split('/')[1];
      } else {
        this.tenantPath = window.location.host.split('.')[0];
      }
    }
    this.setTenantModel.perform();

    return this.tenantPath;
  }

  @dropTask
  *setTenantModel() {
    let tourSets = yield this.store.query('tour-set', {
      subdir: this.tenantPath
    });

    this.tenantModel = tourSets.firstObject;

    yield timeout(300);
  }

  set currentTenant(path) {
    return path;
  }
}
