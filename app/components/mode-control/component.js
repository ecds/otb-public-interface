import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class ModeControlComponent extends Component {
  get dropDown() {
    return document.getElementById('mode-options');
  }

  @action
  setMode(mode) {
    this.args.tour.setProperties({ currentMode: mode });
    if (this.dropDown) UIkit.dropdown(this.dropDown).hide();
  }
}
