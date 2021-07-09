import Component from '@glimmer/component';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class MobileMenuComponent extends Component {
  @action
  initOffCanvas(element) {
    const offCanvas = UIkit.offcanvas(element, { overlay: true });
    UIkit.util.on(offCanvas.$el, 'show', this.args.onOpen);
    UIkit.util.on(offCanvas.$el, 'hide', this.args.onOpen);
  }
}
