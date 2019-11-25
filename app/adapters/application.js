import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';
// import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend({
  fastboot: service(),
  tenant: service(),
  session: service(),
  cookies: service(),

  host: computed( function(){
    return `${ENV.APP.API_HOST}/${this.tenant.currentTenant}`;
  }),

  headers: computed('session.data.authenticated.access_token', function(){
    let headers = {};
    let cookieService = this.get('cookies');
    if (cookieService.exists('ember_simple_auth-session') == false) return;
    let cookies = cookieService.read();
    let access_token = JSON.parse(cookies['ember_simple_auth-session']).authenticated.access_token;
    headers['Authorization'] = `Bearer ${access_token}`;
    return headers;
  })

  // authorizer: 'authorizer:application'

  // authorize(xhr) {
    // let cookieService = this.get('cookies');
    // if (cookieService.exists('ember_simple_auth-session') == false) return;
    // let cookies = cookieService.read();
    // let access_token = JSON.parse(cookies['ember_simple_auth-session']).authenticated.access_token;
  //   xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  // }
});
