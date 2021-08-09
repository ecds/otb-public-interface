import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from "../../config/environment";
import 'intersection-observer';
import scrollama from 'scrollama';


export default class TourDesktopListComponent extends Component {
  @service fastboot;

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
        this.args.setActiveStop.perform(stop, false);
        this.tourSlug = stop.tour.get('slug');
        if (pathParts.lastObject == stop.tour.get('slug')) {
          this._updateHistory(`${this.pathBase}/${stop.slug}`);
        } else {
          this._updateHistory(`/${this.args.tour.tenant}/${this.args.tour.slug}/${stop.slug}`);
        }
      }
    })
    .onStepExit(event => {
      if (event.index == 1 && event.direction == 'up') {
        this._updateHistory(`/${this.args.tour.tenant}/${this.args.tour.slug}`);
        this.args.setActiveStop.perform(null, false);
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
