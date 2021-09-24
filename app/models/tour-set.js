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

  @tracked
  cookiesAcknowledged = this.cookies.read('openTour') == 'yup';

  set cookiesAcknowledged(value) {
    return value;
  }
}
