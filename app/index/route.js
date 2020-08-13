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

  title() {
    return ENV.APP.META_TITLE;
  }

  headTags() {
    return [
      {
        type: 'meta',
        tagId: 'meta-og-title-tag',
        attrs: {
          property: 'og:title',
          content: ENV.APP.META_TITLE
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description-tag',
        attrs: {
          property: 'og:description',
          content: ENV.APP.META_DESCRIPTION
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-tag',
        attrs: {
          property: 'og:image',
          content: 'http://otbimages.ecdsdev.org/uploads/logo.png'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-height',
        attrs: {
          property: 'og:image:height',
          content: 214
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-width-tag',
        attrs: {
          property: 'og:image:width',
          content: 340
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-secure-image-tag',
        attrs: {
          property: 'og:image:secure_url',
          content: 'https://api.opentour.emory.edu/uploads/logo.png'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          name: 'twitter:title',
          content: ENV.APP.META_TITLE
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          name: 'twitter:description',
          content: ENV.APP.META_DESCRIPTION
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          name: 'twitter:image',
          content: 'https://api.opentour.emory.edu/uploads/logo.png'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-card',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      }
    ]
  }
}
