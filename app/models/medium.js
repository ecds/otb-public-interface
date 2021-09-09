import DS from 'ember-data';
import ENV from '../config/environment';
// import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
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
  @attr('number') desktopWeight;
  @attr('number') desktopWidth;
  @attr('number') tabletWidth;
  @attr('number') mobileWidth;
  @attr('number') lqipWidth;
  @hasMany('tour') tours;
  @hasMany('stop') stops;
  @attr('boolean', { defaultValue: false }) loadEmbed;
  @attr() files;

  get baseUrl() {
    return `${ENV.APP.API_HOST}`;
  }

  get imageTag() {
    if (this.files) {
      return htmlSafe(`
      <img class="lazyloaded" alt="${this.caption}"
        data-src="${this.files.desktop}"
        data-srcset="${this.files.desktop} ${this.desktopWidth}w,
          ${this.files.tablet} ${this.tabletWidth}w,
          ${this.files.mobile} ${this.mobileWidth}w,
          ${this.files.lqip} ${this.lqipWidth}w"
        src="${this.files.desktop}"
        srcset="${this.files.desktop} ${this.desktopWidth}w,
          ${this.files.tablet} ${this.tabletWidth}w,
          ${this.files.mobile} ${this.mobileWidth}w,
          ${this.files.lqip} ${this.lqipWidth}w">`);
    }

    return htmlSafe('<img src="/assets/images/loading.png" alt="Branding logo">');
  }

  // @computed('embed')
  // get safeEmbed() {
  //   return htmlSafe(this.get('embed'));
  // }
}
