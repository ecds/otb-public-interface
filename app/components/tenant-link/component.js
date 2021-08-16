import Component from '@glimmer/component';
import ENV from '../../config/environment';
import { inject as service } from '@ember/service';

export default class TenantLinkComponent extends Component {
  @service tenant;
  env = ENV;
}
