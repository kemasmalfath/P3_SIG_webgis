/**
 * WebGIS Simpel - Leaflet.js
 * Membaca langsung data/faskes.geojson
 */

document.addEventListener("DOMContentLoaded", function () {

  // ── Inisialisasi peta ──
  var map = L.map("map").setView([-5.40, 105.26], 12);

  // Basemap OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Group penampung marker
  var markerGroup = L.featureGroup().addTo(map);

  // ── Langsung baca file GeoJSON ──
  fetch("data/faskes.geojson")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Gagal mengambil file GeoJSON: " + response.statusText);
      }
      return response.text();
    })
    .then(function (text) {
      if (!text || !text.trim()) {
        console.warn("File data/faskes.geojson masih kosong. Silakan masukkan data GeoJSON praktikum.");
        return;
      }
      var geojsonData = JSON.parse(text);

      L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng);
        },
        onEachFeature: function (feature, layer) {
          var props = feature.properties || {};
          var nama = props.NAMOBJ || props.nama || (props.id ? "Titik #" + props.id : "Objek");
          var popupHTML = "<b>" + nama + "</b><br><hr style='margin:4px 0'>";

          for (var key in props) {
            if (props.hasOwnProperty(key)) {
              var val = props[key];
              if (val === null || val === "" || val === 0) continue;
              if (key === "NAMOBJ" || key === "nama") continue;
              popupHTML += "<b>" + key + ":</b> " + val + "<br>";
            }
          }

          layer.bindPopup(popupHTML);
          markerGroup.addLayer(layer);
        }
      });

      // Zoom otomatis pas ke semua marker
      if (markerGroup.getLayers().length > 0) {
        map.fitBounds(markerGroup.getBounds(), { padding: [40, 40] });
      }
    })
    .catch(function (err) {
      console.error("Error membaca GeoJSON:", err);
    });

});


