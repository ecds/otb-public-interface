import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class TourStopRoute extends Route {
  @service deviceContext;
  @service fastboot;
  @service router;
  @service store;

  constructor() {
    super(...arguments);

    // this.router.on('routeDidChange', () => {
    //   const { tour, tourStop } = this.modelFor('tour.stop');
    //   const stop = this.store.peekRecord('stop', tourStop.get('stop.id'))
    //   tour.get('stops').forEach(stop => {
    //     stop.setProperties({ active: false });
    //   });
    //   stop.setProperties({ active: true });
    // });
  }

  model(params) {
    return hash({
      tourStop: this.store.queryRecord('tour-stop', {
        slug: params.stop_slug,
        tour: this.modelFor('tour').id,
        fastboot: this.fastboot.isFastBoot
      }),
      tour: this.store.findRecord('tour', this.modelFor('tour').id),
      modes: this.store.findAll('mode')
    });
  }

  afterModel(model) {
    if (this.deviceContext.isDesktop) {
      this.controllerFor('tour').setActiveStop.perform(model.tourStop, true);
    }
  }

  titleToken() {
    const model = this.modelFor('tour.stop').tourStop;
    return model.get('stop.title');
  }

  headTags() {
    const model = this.modelFor('tour.stop').tourStop;
    const stop = this.store.peekRecord('stop', model.get('stop.id'));
    return [
      {
        type: 'meta',
        tagId: 'meta-og-title-tag',
        attrs: {
          property: 'og:title',
          content: stop.title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-description-tag',
        attrs: {
          property: 'og:description',
          content: stop.metaDescription
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-tag',
        attrs: {
          property: 'og:image',
          content: stop.splashUrl
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-image-height',
        attrs: {
          property: 'og:image:height',
          content: stop.splashHeight
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-width-tag',
        attrs: {
          property: 'og:image:width',
          content: stop.splashWidth
        }
      },
      {
        type: 'meta',
        tagId: 'meta-og-secure-image-tag',
        attrs: {
          property: 'og:image:secure_url',
          content: stop.splashUrl
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-title',
        attrs: {
          name: 'twitter:title',
          content: stop.title
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-description',
        attrs: {
          name: 'twitter:description',
          content: stop.metadescription
        }
      },
      {
        type: 'meta',
        tagId: 'meta-twitter-image',
        attrs: {
          name: 'twitter:image',
          content: stop.splashUrl
        }
      }
    ];
  }
}
