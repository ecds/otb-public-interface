import Component from '@glimmer/component';

export default class TourSplashBackgroundComponent extends Component {
  get backgroundImage() {
    if (this.args.tour.splash) {
      return this.args.tour.splash.url;
    } else {
      return '/assets/images/otb-bg.png';
    }
  }
}
