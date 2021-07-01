import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, render } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

// class permissionsStub extends Service {
//   allowLocation = false;
//   updateLocationSet = false;
//   locationAllowed = false;
//   updateLocationAllowed = false;
//   tour = null;

//   get getLocationSet() {
//     return this.allowLocation ? true : false;
//   }

//   get getUpdateLocationSet() {
//     return this.allowUpdate ? true : false;
//   }

//   setTour(tour) {
//     this.tour = tour;
//   }
// }
module('Integration | Component | location-settings', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    // this.owner.register('service:permissions', permissionsStub);
    // this.set('permissions', this.owner.lookup('service:permissions'));
    // this.set('store', this.owner.lookup('service:store'));
    // this.set('cookies', this.owner.lookup('service:cookies'));
    // this.set('tenant', this.owner.lookup('service:tenant'));
    // const tour = this.store.createRecord(
    //   'tour',
    //   {
    //     id: 1,
    //     slug: 'some-tour'
    //   }
    // );
    // this.permissions.setTour(tour);
  });

  test('it renders all off', async function(assert) {
    await render(hbs`<LocationSettings />`);
    // assert.dom('.loc-off').exists();
    // assert.dom('.update-loc-off').exists();
    // assert.dom('.loc-on').doesNotExist();
    // assert.dom('.update-loc-on').doesNotExist();
  });

  test('it renders all on', async function(assert) {
    // this.permissions.locationAllowed = true;
    // this.permissions.updateLocationAllowed = true;
    await render(hbs`<LocationSettings />`);
    // assert.dom('.loc-on').exists();
    // assert.dom('.update-loc-on').exists();
    // assert.dom('.loc-off').doesNotExist();
    // assert.dom('.update-loc-off').doesNotExist();
  });
});
