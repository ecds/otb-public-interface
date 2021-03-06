import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default class TourMediumModel extends Model {
  @belongsTo('tour') tour;
  @belongsTo('medium') medium;
  @attr('number') position;
  @attr('boolean', {
    defaultValue() {
      return false;
    }
  }) loaded;
  @attr('boolean', {
    defaultValue() {
      return false;
    }
  }) loadEmbed;
}
