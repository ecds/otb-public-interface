import EmberObject from '@ember/object';
import { icon as faIcon } from '@fortawesome/fontawesome-svg-core';

const google = window.google;

export default EmberObject.extend({

  parkingIconSVG() {
    return {
      path: faIcon({ prefix: 'fas', iconName: 'map-marker' }).icon.lastObject,
      fillColor: 'blue',
      fillOpacity: 1,
      scale: 0.075,
      anchor: new google.maps.Point(200, 550),
      labelOrigin: new google.maps.Point(200, 200)
    };
  },

  iconSVG(fillColor='#D32F2F') {
    return {
      path: faIcon({ prefix: 'fas', iconName: 'map-marker' }).icon.lastObject,
      fillColor,
      fillOpacity: 1,
      scale: 0.075,
      anchor: new google.maps.Point(200, 550),
      labelOrigin: new google.maps.Point(200, 200)
    };
  },

  imageIcon(url) {
    return {
      url
    };
  },

  createMap(params) {
    if (!google) return;
    let { element = document.getElementById('map-container'), center = {lat: 0, lng:0}, zoom = 17, mapTypeId = 'roadmap'} = params;
    let map = new google.maps.Map(
      element,
      {
        zoom,
        center: center,
        disableDefaultUI: true,
        mapTypeId
      }
    );

    return map;
  },

  addMarker(map, cords, parking=false, stop, animation=false) {
    if (!google) return;
    if (animation) {
      animation = google.maps.Animation.DROP;
    }
    const marker = new google.maps.Marker({
      position: cords,
      title: '',
      animation
    });

    if (parking) {
      marker.setIcon(this.parkingIconSVG());
      marker.setLabel({ text: 'P', color: 'white' });
    } else {
      if (stop.get('mapIcon.originalImageUrl')) {
        marker.setIcon(this.imageIcon(stop.get('mapIcon.originalImageUrl')));
      } else {
        marker.setIcon(this.iconSVG(stop.get('iconColor')));
      }
    }

    marker.setMap(map);
    return marker;
  },

  activateMarker(stop) {
    stop.marker.setIcon(this.activeIcon(stop));
    stop.marker.setLabel({
      text: `${stop.position}`,
      color: 'white',
      fontSize: '2.25rem'
    });
  },

  deactivateMarker(stop) {
    stop.marker.setIcon(this.icon());
    stop.marker.setLabel({
      text: `${stop.position}`,
      color: 'white',
      fontSize: '1rem'
    });
  },

  // icon() {
  //   return {
  //     scaledSize: new google.maps.Size(35, 35),
  //     anchor: new google.maps.Point(20, 40),
  //     origin: new google.maps.Point(0, 0),
  //     labelOrigin: new google.maps.Point(18, 14),
  //     url: '/assets/icons/map-marker.svg'
  //   };
  // },

  activeIcon() {
    return {
      scaledSize: new google.maps.Size(75, 75),
      labelOrigin: new google.maps.Point(36, 28),
      url: '/assets/icons/map-marker.svg'
    };
  },

  setLabel(marker, content) {
    marker.setLabel(
      {
        color: 'white',
        text: `${content}`,
        fontSize: '1rem'
      }
    );
  },

  addInfoWindow(content, marker, map) {
    const infowindow = new google.maps.InfoWindow({ content });
    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
  },

  clearFeatures(features) {
    features.forEach((feature) => {
      feature.setMap(null);
    });
  },

  clearRoute(route) {
    route.setMap(null);
  },

  directionsService() {
    if (!google) return;
    return new google.maps.DirectionsService();
  },

  directionsDisplay() {
    if (!google) return;
    return new google.maps.DirectionsRenderer();
  },

  addControl(map, elementId, position) {
    const element = document.getElementById(elementId);
    element.index = 1;
    if (position == 'TOP_RIGHT') {
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(element);
    } else {
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(element);
    }
  },

  latLngBounds() {
    return new google.maps.LatLngBounds();
  }
});