import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UIkit from 'uikit';

export default class DesktopNavComponent extends Component {
  @tracked
  open = false;

  dropdown = null;

  @action
  initDropdown(element) {
    const dropdownOptions = {
      offset: 0,
      animation: 'uk-animation-slide-top',
      boundary: '.uk-navbar',
      boundaryAlign: true,
      align: 'center'
    };

    this.dropdown = UIkit.dropdown(element, dropdownOptions);
    UIkit.util.on(this.dropdown.$el, 'show', () => this.open = true);
    UIkit.util.on(this.dropdown.$el, 'hide', () => this.open = false);
  }

  @action
  onClick(tourStop) {
    this.dropdown.hide();
    this.args.navigateTo.perform(tourStop, true);
  }
}
