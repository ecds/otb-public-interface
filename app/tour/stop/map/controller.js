import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class TourStopMapController extends Controller {
  @service location;
  @service deviceContext;
  @service cookies;
  @service maps;
}
