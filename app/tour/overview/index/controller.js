import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class TourOverviewIndexController extends Controller {
  @service deviceOrientation;
  @service tenant;
}
