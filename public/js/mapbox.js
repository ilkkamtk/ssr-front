'use strict';
mapboxgl.accessToken =
  'pk.eyJ1IjoiaWxra2FtdGsiLCJhIjoiY2szZ2Z3ZGtzMDFkZTNpcDh2aGFndmg2dyJ9.CjPq5lceUKhfdWD3oqhjwg';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [24, 60], // starting position [lng, lat]
  zoom: 13, // starting zoom
});

const addMarker = (coords) => {
  map.setCenter(coords);
  const marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
};
