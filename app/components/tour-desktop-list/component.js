import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from "../../config/environment";
import 'intersection-observer';
import scrollama from 'scrollama';
import { restartableTask, timeout } from 'ember-concurrency';

export default class TourDesktopListComponent extends Component {
  @service fastboot;
  @service tenant;

  // https://www.youtube.com/watch?v=PFtHeo7oMSU
  redPajamas = scrollama();

  @tracked
  scroller = null;

  @tracked
  tourSlug = null;

  @tracked
  pathBase = null;

  // Called on insert by the template.
  @restartableTask
  *registerScrollListener() {
    if (this.fastboot.isFastBoot) return;
    if (this.pathBase == null) {
      this.pathBase = window.location.pathname;
    }
    const pathParts = window.location.pathname.split('/');
    this.scroller = this.redPajamas.setup({
      step: '.otb-desktop-stop',
      container: '#otb-desktop-stop-list',
      debug: ENV.environment == 'development',
      offset: `${window.innerHeight / 3}px`
    })
    .onStepEnter(event => {
      const stop = this.args.tourStops[event.index - 1];
      if (stop) {
        this.args.setActiveStop.perform(stop, false);
        this.tourSlug = stop.tour.get('slug');
        if (pathParts.lastObject == this.tourSlug) {
          this._updateHistory(`${this.pathBase}/${stop.slug}`);
        } else {
          this._updateHistory(this._buildPath(stop));
        }
      }
    })
    .onStepExit(event => {
      if (event.index == 1 && event.direction == 'up') {
        this._updateHistory(this._buildPath(null));
        this.args.setActiveStop.perform(null, false);
      }
    });
    yield timeout(100);
  }

  resize(_this) {
    // _this.registerScrollListener.perform();
  }

  _updateHistory(path) {
    history.replaceState({}, '', path);
  }

  _buildPath(stop) {
    if (this.tenant.isSubDomain) {
      if (stop) {
        return `/${this.args.tour.slug}/${stop.slug}`;
      }
      return `/${this.args.tour.slug}`;
    }

    return `/${this.args.tour.tenant}/${this.args.tour.slug}/${stop.slug}`;
  }

  @action
  destroyScrollListener() {
    // console.log('destroy');
  }
}
