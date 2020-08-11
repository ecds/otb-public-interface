import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mobile-stop-route', function(hooks) {
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

    await render(hbs`<MobileStopRoute @stop={{this.stop}} />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <MobileStopRoute>
        template block text
      </MobileStopRoute>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
