import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ReadItComponent extends Component {
  @service fastboot;

  @tracked speaking = false;
  @tracked supported = false;
  @tracked synth = null;
  @tracked utterance = null;
  @tracked paused = false;

  read() {
    this.synth.speak(this.utterance);
  }

  @action
  registerUtterance() {
    if (this.fastboot.isFastBoot) return;
    if ('speechSynthesis' in window) {
      this.supported = true;
      this.utterance = new SpeechSynthesisUtterance(this.args.content);
      this.utterance.lang = this.args.lang || navigator.language;
      this.utterance.text = this.args.content.substr(0, 250);
      this.utterance.onend = () => {
        this.speaking = false;
        this.paused = false;
      };
      this.utterance.onstart = () => {
        this.speaking = true;
        this.paused = false;
      };

      this.synth = window.speechSynthesis;
    }
  }

  @action
  destroyUtterance() {
    if (this.fastboot.isFastBoot) return;
    if (this.synth !== null) {
      this.synth.resume();
      this.synth.cancel();
    }
  }

  @action
  sayIt() {
    if (this.fastboot.isFastBoot) return;
    this.speaking = true;
    if (this.paused) {
      this.paused = false;
      this.synth.resume();
    } else {
      this.synth.cancel();
      this.read();
    }
  }

  @action
  pause() {
    this.speaking = false;
    this.paused = true;
    this.synth.pause();
  }
}
