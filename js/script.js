// Encapsulating global variables
const app = (() => {
  let map, markers, countryData, countryName, countryCode, infoButton;

  function init() {
    map = L.map("map", {
      attributionControl: false,
      minZoom: 2,
      maxBounds: [
        [-180, -180],
        [180, 180],
      ],
      zoomControl: false,
    });
    
    markers = L.markerClusterGroup({ showCoverageOnHover: false });

    const baseLayers = {
      Streets: L.tileLayer("https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=YOUR_ACCESS_TOKEN", {
        attribution: '&copy; <b>Jawg</b> Maps &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: "abcd",
        accessToken: "YOUR_ACCESS_TOKEN",
      }),
      Dark: L.tileLayer("https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=YOUR_ACCESS_TOKEN", {
        attribution: '&copy; <b>Jawg</b> Maps &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: "abcd",
        accessToken: "YOUR_ACCESS_TOKEN",
      }),
      Satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }),
      Night: L.tileLayer("https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}", {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975],
        ],
        minZoom: 1,
        maxZoom: 8,
        format: "jpg",
        time: "",
        tilematrixset: "GoogleMapsCompatible_Level",
      }),
    };

    map.addLayer(baseLayers.Streets);
    L.control.layers(baseLayers).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);
    L.easyButton("fa-location-arrow", () => map.locate(), { position: "topright" }).addTo(map);

    infoButton = L.easyButton("fa-info", () => $("#countryModal").modal("toggle"), { position: "topleft" }).addTo(map).disable();

    addCountryListControl();
    getCountryList();

    map.on("click", onMapClick);
    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
  }

  function addCountryListControl() {
    L.Control.CountryList = L.Control.extend({
      onAdd: function () {
        const $select = $('<select id="countryList" class="form-control leaflet-control leaflet-bar" onchange="app.validateCountry(this.value)"></select>');
        $select.append('<option value="" disabled selected hidden>Select a country</option>');
        return $select.get(0);
      },
    });
    L.control.countryList = function (opts) {
      return new L.Control.CountryList(opts);
    };
    L.control.countryList({ position: "topleft" }).addTo(map);
    L.DomEvent.disableClickPropagation($("#countryList").get(0));
  }

  function checkURLHash() {
    if (location.hash) {
      const hash = decodeURI(location.hash.substring(1));
      validateCountry(hash);
    } else {
      map.locate();
    }
  }

  function convertTime(unix, offset) {
    const d = new Date((unix + offset) * 1000);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }

  function displayBorders() {
    const data = countryData.borders.geometry;
    let borders = [];

    if (data.type === "MultiPolygon") {
      data.coordinates.forEach((poly) => {
        let coords = poly[0].map(coord => [coord[1], coord[0]]);
        borders.push(coords);
      });
    } else {
      borders = data.coordinates[0].map(coord => [coord[1], coord[0]]);
    }

    map.fitBounds(borders);
    const borderLayer = L.geoJSON({ type: "FeatureCollection", features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: borders } }] }, {
      style: { color: "red", weight: 2 }
    }).addTo(map);

    map.once("zoomend", () => map.removeLayer(borderLayer));
  }

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }

  function geocode() {
    const params = { q: countryName, format: "json" };
    $.getJSON("php/geocode.php", params)
      .done(data => {
        const [result] = data.results;
        countryCode = result.country_code || null;
        getCountry();
      })
      .fail(() => console.error("Error geocoding country"));
  }

  function getCountry() {
    const params = {
      open: countryName,
      rest: countryName,
      codes: countryCode,
    };

    $.getJSON("php/api.php", params)
      .done(data => {
        countryData = data;
        displayBorders();
        // other display functions
      })
      .fail(() => console.error("Error fetching country data"));
  }

  function displayCities() {
    // Implementation for displaying cities on the map
  }

  function displayMountains() {
    // Implementation for displaying mountains on the map
  }

  function displayPOIs() {
    // Implementation for displaying points of interest on the map
  }

  function displayCovid() {
    // Implementation for displaying COVID-19 data
  }

  function displayRates() {
    // Implementation for displaying exchange rates
  }

  function weather() {
    const params = { q: countryName, format: "json" };
    $.getJSON("php/weather.php", params)
      .done(data => {
        // Update modal with weather information
      })
      .fail(() => console.error("Error fetching weather data"));
  }

  function validateCountry(countryId) {
    if (!countryId) return;
    countryName = countryId;
    geocode();
  }

  function onMapClick(event) {
    // Handle map click event
  }

  function onLocationFound(event) {
    // Handle location found event
  }

  function onLocationError(event) {
    console.error("Location error:", event.message);
  }

  return {
    init,
    validateCountry,
  };
})();

$(document).ready(() => {
  app.init();
});
