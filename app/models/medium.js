import DS from 'ember-data';
import ENV from '../config/environment';
// import { computed } from '@ember/object';
// import { htmlSafe } from '@ember/string';
const { Model, attr, hasMany } = DS;
import { inject as service } from '@ember/service';

export default class MediumModel extends Model {
  @service deviceContext;

  @attr('string') title;
  @attr('string') caption;
  @attr('string') video;
  @attr('string') embed;
  @attr('string') desktop;
  @attr('string') tablet;
  @attr('string') mobile;
  @attr('string') insecure;
  @attr('string') provider;
  @attr('string') originalImageUrl;
  @attr('number') desktop_height;
  @attr('number') desktop_width;
  @hasMany('tour') tours;
  @hasMany('stop') stops;
  @attr('boolean', { defaultValue: false }) loadEmbed;
  @attr() files;

  get baseUrl() {
    return `${ENV.APP.API_HOST}`;
  }

  // @computed('embed')
  // get safeEmbed() {
  //   return htmlSafe(this.get('embed'));
  // }
}
