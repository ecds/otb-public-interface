import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class DirectionsErrorComponent extends Component {
  modal = null;

  @action
  async initModal(element) {
    this.modal = await UIkit.modal(element);
    this.modal.show();
    if (this.args.onClose) {
      UIkit.util.on(this.modal.$el, 'hide', this.args.onClose);
    }
  }
}
