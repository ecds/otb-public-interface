const { Model, attr, belongsTo, hasMany } = DS;
import DS from 'ember-data';
// import ENV from '../config/environment';
import { sort } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';

export default class StopModel extends Model {
  @service maps;
  @attr('string') title;
  @attr('string') slug;
  @attr('number') lat;
  @attr('number') lng;
  @attr('number') parkingLat;
  @attr('number') parkingLng;
  @attr('string') sanitizedDescription;
  @attr('string') sanitizedDirectionNotes;
  @attr('string') description;
  @attr('string') metaDescription;
  @attr('string') articleLink;
  @attr('string') articleLink;
  @attr('string') videoEmbed;
  @attr('string') videoPoster;
  @attr('string') directionIntro;
  @attr('string') directionNotes;
  @attr('string') iconColor;
  @attr('string') insecureSplash;
  @attr('number') splashHeight;
  @attr('number') splashWidth;
  @attr('boolean' , { defaultValue: false }) active;
  @attr('boolean', { defaultValue: false }) show;
  @attr('boolean' , { defaultValue: false }) showOverviewInfoWindow;
  @attr('boolean' , { defaultValue: true }) showInfoWindow;
  @attr('boolean' , { defaultValue: false }) showParkingInfoWindow;
  @attr() splash;
  @attr() travelDirections;
  @hasMany('tour_stop', { async: true }) tourStops;
  @hasMany('stop_medium', { async: true }) stopMedia;
  @hasMany('medium', { async: true }) media;
  @belongsTo('mapIcon') mapIcon;

  get splashUrl() {
    if (this.splash) {
      return this.splash.url;
    }
    return '/assets/images/otblogo.png';
  }

  get safeDescription() {
    return new htmlSafe(
      this.get('description')
    );
  }

  get icon() {
    // if (this.mapIcon.get('imageUrl')) {
    //   return this.mapIcon.get('imageUrl');
    // }
    const icon = this.markerIconSVG;
    if (this.active) {
      icon.scale = .125;
      icon.scaledSize = new this.maps.google.maps.Size(100, 100);
    }
    return icon;
  }

  get markerIconSVG() {
    const icon = {
      fillColor: this.iconColor,
      fillOpacity: 1,
      scale: 0.075,
      label: 'X',
      labelOrigin: new this.maps.google.maps.Point(200, 200)
    };

    if (this.mapIcon.get('imageUrl')) {
      return icon.url = this.mapIcon.get('imageUrl');
    } else {
      icon.anchor = new this.maps.google.maps.Point(200, 600);
      icon.path = faIcon({ prefix: 'fas', iconName: 'map-marker' }).icon.lastObject;
    }

    // const svgIcon = {
    // };

    // return Object.assign(icon, svgIcon );
    return icon;
  }

  get hasMedia() {
    return this.sortedMedia.length > 0;
  }

  get hasParking() {
    // return typeof this.parkingLat == 'number' && typeof this.parkingLat == 'number';
    return !isNaN(this.parkingLat) && !isNaN(this.parkingLat);
  }

  get parkingIconSVG() {
    return {
      path: faIcon({ prefix: 'fas', iconName: 'map-marker' }).icon.lastObject,
      fillColor: 'blue',
      fillOpacity: 1,
      scale: 0.075,
      labelOrigin: new this.maps.google.maps.Point(200, 200),
      anchor: new this.maps.google.maps.Point(200, 600)
    };
  }

  _positionSort = Object.freeze(['position:asc']);

  @sort('stopMedia', '_positionSort')
  sortedMedia;
}
