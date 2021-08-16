import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

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

  async afterModel(model) {
    if (model.length == 1) {
      if (ENV.APP.TENANT) {
        this.transitionTo('tour.overview', model.firstObject.slug);
      } else {
        this.transitionTo('tour.overview', this.tenant.tenantPath, model.firstObject.slug);
      }
    }

  }

  title() {
    const model = this.modelFor('tours');
    return model.firstObject.get('tenantTitle');
  }

  headTags() {
    const model = this.modelFor('tours');
    return [
      {
        type: 'meta',
        tagId: 'meta-og-title-tag',
        attrs: {
          property: 'og:title',
          content: model.firstObject.get('tenantTitle')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description-tag',
        attrs: {
          property: 'og:description',
          content: 'A collection of tours built with OpenTourBuilder'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-tag',
        attrs: {
          property: 'og:image',
          content: model.firstObject.get('insecureSplash')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-height',
        attrs: {
          property: 'og:image:height',
          content: model.firstObject.get('splashHeight')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-width-tag',
        attrs: {
          property: 'og:image:width',
          content: model.firstObject.get('splashWidth')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-secure-image-tag',
        attrs: {
          property: 'og:image:secure_url',
          content: model.firstObject.get('splashUrl')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          name: 'twitter:title',
          content: model.firstObject.get('tenantTitle')
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          name: 'twitter:description',
          content: 'A collection of tours built with OpenTourBuilder'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          name: 'twitter:image',
          content: model.firstObject.splashUrl
        }
      }
    ];
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
