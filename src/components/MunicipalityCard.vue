<template>
  <md-card class="municipalityView">
    <md-card-header>
      <h3 class="md-title">
        <span>Kommune {{ municipalityNumber }}</span>
        <span v-show="municipality.name">: {{ municipality.name }}</span>
      </h3>
    </md-card-header>
    <md-card-content>
      <MunicipalityInput
        :municipalities="municipalities"
        @selectedMunicipality="handleSelectedMunicipality"
        @inputCleared="handleInputCleared"
      ></MunicipalityInput>
      <div class="municipalityInfo">
        <p
          class="md-body-1"
          v-show="municipality.numInhabitants"
        >har {{ municipality.numInhabitants }} innbyggere</p>
        <div v-show="loadingInhabitants == true">
          <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </div>
        <p
          class="md-body-1"
          v-show="municipality.roadLength"
        >og har {{ municipality.roadLength }} meter bilvei</p>
        <div v-show="loadingRoadLength == true">
          <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </div>
        <p v-show="municipality.numInhabitants && municipality.roadLength">
          som betyr at det er
          <strong>{{ roadPerInhabitant }}</strong> meter bilvei
          <br />per innbygger i kommunen.
        </p>
      </div>
      <CardExpand
        v-show="municipality.inhabitantYear"
        :inhabitantQuarter="municipality.inhabitantQuarter"
        :inhabitantYear="municipality.inhabitantYear"
      />
      <MapContainer v-if="showMap" :municipalityPolygon="municipality.polygon" />
    </md-card-content>
  </md-card>
</template>

<script>
import MunicipalityInput from "./MunicipalityInput";
import CardExpand from "./CardExpand";
import MapContainer from "./MapContainer";
import SsbApiService from "../SsbApiService";
import VegvesenApiService from "../VegvesenApiService";

const ssbApiService = new SsbApiService();
const vegvesenApiService = new VegvesenApiService();

export default {
  name: "MunicipalityCard",
  components: {
    MunicipalityInput,
    CardExpand,
    MapContainer
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
      inhabitantYear: null,
      inhabitantQuarter: null,
      roadLength: null,
      polygon: null
    },
    loadingRoadLength: false,
    loadingInhabitants: false,
    showMap: false
  }),
  computed: {
    roadPerInhabitant: function() {
      return Number.parseFloat(
        this.municipality.roadLength / this.municipality.numInhabitants
      ).toFixed(2);
    }
  },
  methods: {
    handleSelectedMunicipality: function(municipalityObj) {
      this.loadingRoadLength = true;
      this.loadingInhabitants = true;
      this.municipality.name = municipalityObj["name"];
      this.municipality.code = municipalityObj["code"];
      ssbApiService
        .getNumberOfInhabitants(
          municipalityObj["code"],
          new Date().getFullYear()
        )
        .then(resultObj => {
          this.loadingInhabitants = false;
          this.municipality.numInhabitants = resultObj.numInhabitants;
          this.municipality.inhabitantYear = resultObj.year;
          this.municipality.inhabitantQuarter = resultObj.quarter;
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
        });
    },
    handleInputCleared: function() {
      this.showMap = false;
      this.municipality.numInhabitants = null;
      this.municipality.roadLength = null;
      this.municipality.name = null;
      this.municipality.code = null;
      this.municipality.polygon = null;
      this.municipality.inhabitantYear = null;
      this.municipality.inhabitantQuarter = null;
    }
  }
};
</script>

<style scoped>
.municipalityView {
  flex-grow: 1;
  min-width: 320px;
  max-width: 450px;
}

@media screen and (max-width: 1024px) {
  .municipalityView {
    margin-bottom: 5em;
  }
}

@media screen and (min-width: 657px) {
  .municipalityView {
    margin-right: 1em;
    margin-left: 1em;
  }
}
</style>