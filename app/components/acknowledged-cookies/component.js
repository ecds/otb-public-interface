import Component from '@glimmer/component';
import { action } from '@ember/object';

import UIkit from 'uikit';

export default class AcknowledgedCookiesComponent extends Component {
  @action
  initModal() {
    UIkit.modal.confirm('UIkit confirm!').then(function () {
      console.log('Confirmed.');
  }, function () {
      console.log('Rejected.');
  });
  }
}
