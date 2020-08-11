import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mobile-stop-map', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('store', this.owner.lookup('service:store'));
    const tour = this.store.createRecord(
      'tour',
      {
        mapType: 'awesome'
      }
    );
    const stop = this.store.createRecord(
      'stop',
      {
        lat: 42,
        lng: 42
      }
    );
    this.set('tour', tour);
    this.set('stop', stop);
  });


  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MobileStopMap @stop={{this.stop}} @tour={{this.tour}} />`);

    assert.equal(this.element.textContent.trim(), '');

  });
});
