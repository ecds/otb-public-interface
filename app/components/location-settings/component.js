import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LocationSettingsComponent extends Component {

  @action
  togglePermission(permission) {
    this.args.tour.setProperties({
      [permission]: !this.args.tour[permission]
    });
  }
}
