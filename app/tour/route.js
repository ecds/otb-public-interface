import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default class TourRoute extends Route {
  @service fastboot;
  @service headData;
  @service maps;
  @service theme;

  async model(params) {
    if (!this.fastboot.isFastBoot) this.maps.setUpGoogle();
    const tour = await this.store.queryRecord('tour', { slug: params.tour_slug });
    await tour.get('tourStops').forEach(tourStop => this.store.findRecord('tourStop', tourStop.get('id')));
    await tour.get('tourStops').forEach(tourStop => this.store.findRecord('tourStop', tourStop.get('id')));
    await this.store.findRecord('mapOverlay', tour.mapOverlay.get('id'));
    // await tour.get('tourMedia').forEach(tourMedium => this.store.findRecord('tourMedium', tourMedium.get('id')));
    // await tour.get('media').forEach(media => this.store.findRecord('media', media.get('id')));
    return tour;
  }

  afterModel(model) {
    this.theme.setTour(model);
  }

  title(tokens) {
    tokens = A(tokens);
    const model = this.modelFor('tour');
    tokens.push(model.title);
    return `${model.tenantTitle}: ${tokens.join(' - ')}`;
  }

  headTags() {
    const model = this.modelFor('tour');
    return [
      {
        type: 'meta',
        tagId: 'meta-og-title-tag',
        attrs: {
          property: 'og:title',
          content: model.title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description-tag',
        attrs: {
          property: 'og:description',
          content: model.metaDescription
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-tag',
        attrs: {
          property: 'og:image',
          content: model.insecureSplash
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-secure-image-tag',
        attrs: {
          property: 'og:image:secure_url',
          content: model.splashUrl
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-height',
        attrs: {
          property: 'og:image:height',
          content: model.splashHeight
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-width-tag',
        attrs: {
          property: 'og:image:width',
          content: model.splashWidth
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-site_name',
        attrs: {
          name: 'og:site_name',
          content: model.tenantTitle
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-card',
        attrs: {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          name: 'twitter:title',
          content: model.title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          name: 'twitter:description',
          content: model.metaDescription
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          name: 'twitter:image',
          content: model.splashUrl
        }
      }
    ];
  }
}
