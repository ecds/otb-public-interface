import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class LocationSettingsComponent extends Component {

  @action
  toggleLocationPermissions() {
    this.args.tour.setProperties({
      allowLocation: !this.args.tour.allowLocation
    });
  }

  @action
  toggleUpdatePermissionsOn() {
    this.args.tour.setProperties({
      allowUpdateLocation: !this.args.tour.allowUpdateLocation
    });
  }
}
