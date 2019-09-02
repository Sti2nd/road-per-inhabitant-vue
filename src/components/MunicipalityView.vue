<template>
  <div class="municipalityView">
    <h3>
      Kommune {{ municipalityNumber }}
      <span
        v-show="selectedMunicipality"
      >- {{ selectedMunicipality }}</span>
    </h3>
    <MunicipalityInput
      :municipalities="municipalities"
      @selectedMunicipality="handleSelectedMunicipality"
      @inputCleared="handleInputCleared"
    ></MunicipalityInput>
    <div class="municipalityInfo">
      <p class="md-body-1" v-show="numberOfInhabitants">har {{ numberOfInhabitants }} innbyggere</p>
      <div v-show="loadingInhabitants == true">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>
      <p class="md-body-1" v-show="roadLength">og har {{ roadLength }} meter bilvei</p>
      <div v-show="loadingRoadLength == true">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
      </div>
      <p v-show="numberOfInhabitants && roadLength">
        som betyr at det er
        <strong>{{ Number.parseFloat(roadLength / numberOfInhabitants).toFixed(2) }}</strong> meter bilvei
        <br />per innbygger i kommunen.
      </p>
    </div>
    <div v-if="mapCenter" id="mapContainer">
      <l-map :zoom="9" :center="mapCenter">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          :attribution="mapAttribution"
        />
      </l-map>
    </div>
  </div>
</template>

<script>
import MunicipalityInput from "./MunicipalityInput";
import SsbApiService from "../SsbApiService";
import VegvesenApiService from "../VegvesenApiService";
import { latLng } from "leaflet";
import { LMap, LTileLayer} from "vue2-leaflet";
import 'leaflet/dist/leaflet.css';

const ssbApiService = new SsbApiService();
const vegvesenApiService = new VegvesenApiService();

export default {
  name: "MunicipalityView",
  components: {
    MunicipalityInput,
    LMap,
    LTileLayer
  },
  props: {
    municipalityNumber: Number,
    municipalities: Array
  },
  data: () => ({
    selectedMunicipality: null,
    selectedMunicipalityCode: null,
    numberOfInhabitants: null,
    roadLength: null,
    loadingRoadLength: false,
    loadingInhabitants: false,
    mapAttribution:
      "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors",
    mapCenter: null
  }),
  methods: {
    handleSelectedMunicipality: function(municipalityObj) {
      this.loadingRoadLength = true;
      this.loadingInhabitants = true;
      this.selectedMunicipality = municipalityObj["name"];
      this.selectedMunicipalityCode = municipalityObj["code"];
      ssbApiService
        .getNumberOfInhabitants(municipalityObj["code"])
        .then(response => {
          this.loadingInhabitants = false;
          this.numberOfInhabitants = response["value"][0];
        });
      vegvesenApiService
        .getLengthOfRoads(municipalityObj["code"])
        .then(length => {
          this.loadingRoadLength = false;
          this.roadLength = length;
        });
      vegvesenApiService
        .getMunicipalityCoordinates(municipalityObj["code"])
        .then(coordinates => {
          let reversedCoordinates = [coordinates[1], coordinates[0]];
          this.mapCenter = reversedCoordinates;
        });
    },
    handleInputCleared: function() {
      this.numberOfInhabitants = null;
      this.roadLength = null;
      this.selectedMunicipality = null;
      this.selectedMunicipalityCode = null;
      this.mapCenter = null;
    }
  }
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
</style>