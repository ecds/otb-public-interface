import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from "../../config/environment";
import 'intersection-observer';
import scrollama from 'scrollama';


export default class TourDesktopListComponent extends Component {
  @service fastboot;
  @service router;

  // https://www.youtube.com/watch?v=PFtHeo7oMSU
  redPajamas = scrollama();

  @tracked
  scroller = null;
  @tracked
  tourSlug = null;
  @tracked
  pathBase = null;

  // Called on insert by the template.
  @action
  registerScrollListener() {
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
        this.args.setActiveStop.perform(this.args.tourStops, stop, false);
        this.tourSlug = stop.tour.get('slug');
        if (pathParts.lastObject == stop.tour.get('slug')) {
          this._updateHistory(`${this.pathBase}/${stop.slug}`);
        } else {
          this._updateHistory(stop.slug);
        }
        // this.router.transitionTo('tour.stop', stop.slug);
      }
    })
    .onStepExit(event => {
      if (event.index == 1 && event.direction == 'up') {
        this.args.setActiveStop.perform(this.args.tourStops, null, false);
        this._updateHistory(this.pathBase);
      }
    });
  }

  _updateHistory(path) {
    history.replaceState({}, '', path);
  }

  @action
  destroyScrollListener() {
    // console.log('destroy');
  }
}
