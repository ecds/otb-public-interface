import Component from '@glimmer/component';
// import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// import { tracked } from '@glimmer/tracking';
import UIkit from 'uikit';

export default class ModeControlComponent extends Component {
  // @service cookies;
  // @service store;
  // @service tenant;
  // @service maps;

  // @tracked
  // currentMode = null;

  get dropDown() {
    return document.getElementById('mode-options');
  }

  @action
  setMode(mode) {
    this.args.tour.setProperties({ currentMode: mode });
    if (this.dropDown) UIkit.dropdown(this.dropDown).hide();
  }

  // get tourModeFromCookie() {
  //   const preferredMode = this.cookies.read(`${tour.slug}-${tour.id}-travel-mode`);
  //   if (preferredMode) {
  //     let modeFromCookie = this.store.peekRecord('mode', preferredMode);
  //     return modeFromCookie;
  //   }
  //   // Fall back to default for Tour.
  //   return this.args.tour.mode;
  // }

  // get tourModeCookieName() {
  //   const tour = this.args.tour;
  //   return `${tour.slug}-${tour.id}-travel-mode`
  // }
}
