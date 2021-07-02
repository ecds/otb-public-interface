import DS from 'ember-data';
import { htmlSafe } from '@ember/string';
const { Model, attr, hasMany } = DS;

export default class FlatPageModel extends Model {
  @attr('string') title;
  @attr('string') slug;
  @attr('string', { defaultValue: '' }) body;
  @hasMany('tour') tours;
  @hasMany('tour-flat-pages') tourFlatPages;

  get safeContent() {
    return new htmlSafe(this.body);
  }
}
