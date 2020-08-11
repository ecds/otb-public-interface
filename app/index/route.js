import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';

export default class IndexRoute extends Route {
  @service tenant;

  beforeModel() {
    if (ENV.APP.TENANT) {
      this.transitionTo('tours');
    } else {
      this.tenant.set('currentTenant', 'public');
    }
  }

  model() {
    return this.store.findAll('tourSet');
  }

  headTags() {
    return [
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-title-tag',
      //   attrs: {
      //     property: 'og:title',
      //     content: model.firstObject.get('tenantTitle')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-description-tag',
      //   attrs: {
      //     property: 'og:description',
      //     content: model.stop.get('metaDescription')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-image-tag',
      //   attrs: {
      //     property: 'og:image',
      //     content: model.stop.get('insecureSplash')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-image-height',
      //   attrs: {
      //     property: 'og:image:height',
      //     content: model.stop.get('splashHeight')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-width-tag',
      //   attrs: {
      //     property: 'og:image:width',
      //     content: model.stop.get('splashWidth')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-og-secure-image-tag',
      //   attrs: {
      //     property: 'og:image:secure_url',
      //     content: model.stop.get('splashUrl')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-twitter-title',
      //   attrs: {
      //     name: 'twitter:title',
      //     content: model.stop.get('title')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-twitter-description',
      //   attrs: {
      //     name: 'twitter:description',
      //     content: model.stop.get('metadescription')
      //   }
      // },
      // {
      //   type: 'meta',
      //   tagId: 'meta-twitter-image',
      //   attrs: {
      //     name: 'twitter:image',
      //     content: model.stop.get('splashUrl')
      //   }
      // }
    ]
  }
}
