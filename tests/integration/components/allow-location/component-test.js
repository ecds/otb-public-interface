import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

class LocationPermissionsStub extends Service {
  locationAllowed = false;
  updateLocationAllowed = true;
  tour = null;

  setTour(tour) {
    this.tour = tour;
  }
}

module('Integration | Component | allow-location', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:locationPermissions', LocationPermissionsStub);
    this.set('locationPermissions', this.owner.lookup('service:locationPermissions'));
    this.set('store', this.owner.lookup('service:store'));
    this.set('cookies', this.owner.lookup('service:cookies'));
    this.set('tenant', this.owner.lookup('service:tenant'));
    const tour = this.store.createRecord(
      'tour',
      {
        id: 1,
        slug: 'some-tour'
      }
    );
    this.locationPermissions.setTour(tour);
  });

  test('it renders buttons to allow location', async function(assert) {
    await render(hbs`<AllowLocation />`);
    await settled
    assert.dom('.uk-modal-body').hasText('To provide directions, this tour needs to use your location. Decline Allow');
    assert.dom('#decline-loc').exists();
    assert.dom('#allow-loc').exists();
    assert.dom('#decline-loc-update').doesNotExist();
    assert.dom('#allow-loc-update').doesNotExist();
  });

  test('it renders buttons to allow update', async function(assert) {
    this.locationPermissions.locationAllowed = true;
    this.locationPermissions.updateLocationAllowed = false;
    await render(hbs`<AllowLocation />`);
    assert.dom('.uk-modal-body').hasText('Do you want your location and directions to update as you travel to the stop? Decline Allow');
    assert.dom('#decline-loc').doesNotExist();
    assert.dom('#allow-loc').doesNotExist();
    assert.dom('#decline-loc-update').exists();
    assert.dom('#allow-loc-update').exists();
  });

  test('it renders no buttons', async function(assert) {
    this.locationPermissions.locationAllowed = true;
    this.locationPermissions.updateLocationAllowed = true;
    await render(hbs`<AllowLocation />`);
    assert.dom('#decline-loc').doesNotExist();
    assert.dom('#allow-loc').doesNotExist();
    assert.dom('#decline-loc-update').doesNotExist();
    assert.dom('#allow-loc-update').doesNotExist();
});

});
