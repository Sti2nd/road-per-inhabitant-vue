<template>
  <div id="mapContainer">
    <l-map ref="myMap" :zoom="9" :bounds="mapBounds">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        :attribution="mapAttribution"
      />
      <l-geo-json ref="geojson" :geojson="municipalityPolygon"></l-geo-json>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";

export default {
  name: "MapContainer",
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  props: {
    municipalityPolygon: Object
  },
  data: () => ({
    mapAttribution:
      "Map data © <a href='https://openstreetmap.org' target='_blank'>OpenStreetMap</a>" +
      " contributors",
    mapBounds: null
  }),
  created: function() {
    this.$nextTick(() => {
      let bounds = this.$refs.geojson.mapObject.getBounds();
      this.$refs.myMap.mapObject.fitBounds(bounds);
    });
  }
};
</script>

<style scoped>
#mapContainer {
  height: 50%;
  height: 40vh;
}
</style>