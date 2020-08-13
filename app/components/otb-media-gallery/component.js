import Component from '@glimmer/component';
import ENV from '../../config/environment';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import UIkit from 'uikit';

export default class OtbMediaGalleryComponent extends Component {
  @service deviceContext;
  imageBasePath = ENV.APP.API_HOST;

  @action
  showEmbed(medium) {
    if (!medium.get('medium.video')) return;
    medium.medium.setProperties({ loadEmbed: true })
  }

  @action
  initModal(element) {
    let options = {};
    UIkit.modal(element, options);
  }

  @action
  pauseYouTube(elementId, provider) {
    if (provider != 'youtube') return;
    const iFrame = document.getElementById(elementId).querySelector('iFrame');
    if (!iFrame) return;
    iFrame.contentWindow.postMessage(
      '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
      '*'
    );
  }
}
