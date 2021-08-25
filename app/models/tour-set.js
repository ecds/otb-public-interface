import DS from 'ember-data';
const { Model, attr } = DS;
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TourSetModel extends Model {
  @service cookies;
  @service fastboot;

  @attr('string') name;
  @attr('string') subdir;
  @attr('string') logoUrl;
  @attr() publishedTours;
  @attr() mapableTours;
  // @attr('boolean', { defaultValue: this._cookiesAcknowledge }) cookiesAcknowledged;

  @tracked
  cookiesAcknowledged = this.cookies.read('openTour') == 'yup';

  set cookiesAcknowledged(value) {
    console.log("🚀 ~ file: tour-set.js ~ line 23 ~ TourSetModel ~ setcookiesAcknowledged ~ value", value);
    return value;
  }
}
