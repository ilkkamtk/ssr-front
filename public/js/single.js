'use strict';
// select existing html elements
const img = document.querySelector('#image img');

addMarker(JSON.parse(img.dataset.coords));
