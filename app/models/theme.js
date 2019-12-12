import DS from 'ember-data';
const { Model, attr } = DS;

export default class ThemeModel extends Model {
  @attr('string') title;
}
