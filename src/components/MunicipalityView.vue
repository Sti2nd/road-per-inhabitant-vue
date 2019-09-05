<template>
  <div class="municipalityView">
    <h3>
      Kommune {{ municipalityNumber }}
      <span
        v-show="municipality.name"
      >- {{ municipality.name }}</span>
    </h3>
    <MunicipalityInput
      :municipalities="municipalities"
      @selectedMunicipality="handleSelectedMunicipality"
      @inputCleared="handleInputCleared"
    ></MunicipalityInput>
    <div class="municipalityInfo">
      <p class="md-body-1" v-show="municipality.numInhabitants">har {{ municipality.numInhabitants }} innbyggere</p>
      <div v-show="loadingInhabitants == true">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>
      <p class="md-body-1" v-show="municipality.roadLength">og har {{ municipality.roadLength }} meter bilvei</p>
      <div v-show="loadingRoadLength == true">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>
      <p v-show="municipality.numInhabitants && municipality.roadLength">
        som betyr at det er
        <strong>{{ Number.parseFloat(municipality.roadLength / municipality.numInhabitants).toFixed(2) }}</strong> meter bilvei
        <br />per innbygger i kommunen.
      </p>
    </div>
    <div v-if="showMap" id="mapContainer">
      <l-map ref="myMap" :zoom="9" :bounds="mapBounds">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="mapAttribution"
        />
        <l-geo-json ref="geojson" :geojson="municipality.polygon"></l-geo-json>
      </l-map>
    </div>
  </div>
</template>

<script>
import MunicipalityInput from "./MunicipalityInput";
import SsbApiService from "../SsbApiService";
import VegvesenApiService from "../VegvesenApiService";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

const ssbApiService = new SsbApiService();
const vegvesenApiService = new VegvesenApiService();

export default {
  name: "MunicipalityView",
  components: {
    MunicipalityInput,
    LMap,
    LTileLayer,
    LGeoJson
  },
  props: {
    municipalityNumber: Number,
    municipalities: Array
  },
  data: () => ({
    municipality: {
      name: null,
      code: null,
      numInhabitants: null,
      roadLength: null,
      polygon: null
    },
    loadingRoadLength: false,
    loadingInhabitants: false,
    mapAttribution:
      "Map data © <a href='https://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors",
    mapBounds: null,
    showMap: false
  }),
  methods: {
    handleSelectedMunicipality: function(municipalityObj) {
      this.loadingRoadLength = true;
      this.loadingInhabitants = true;
      this.municipality.name = municipalityObj["name"];
      this.municipality.code = municipalityObj["code"];
      ssbApiService
        .getNumberOfInhabitants(municipalityObj["code"])
        .then(numInhabitants => {
          this.loadingInhabitants = false;
          this.municipality.numInhabitants = numInhabitants;
        });
      vegvesenApiService
        .getLengthOfRoads(municipalityObj["code"])
        .then(length => {
          this.loadingRoadLength = false;
          this.municipality.roadLength = length;
        });
      vegvesenApiService
        .getMunicipalityCoordinates(municipalityObj["code"])
        .then(coordinates => {
          this.municipality.polygon = coordinates;
          this.showMap = true;
          this.$nextTick(() => {
            let bounds = this.$refs.geojson.mapObject.getBounds();
            this.$refs.myMap.mapObject.fitBounds(bounds);
          });
        });
    },
    handleInputCleared: function() {
      this.showMap = false;
      this.municipality.numInhabitants = null;
      this.municipality.roadLength = null;
      this.municipality.name = null;
      this.municipality.code = null;
      this.municipality.polygon = null;
    }
  }
};
</script>

<style scoped>
#mapContainer {
  height: 50%;
}

.municipalityView {
  flex-grow: 1;
  min-width: 300px;
  height: 80vh;
}
</style>