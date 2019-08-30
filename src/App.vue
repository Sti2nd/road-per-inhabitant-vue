<template>
  <div id="app">
    <h1>Bilvei per innbygger</h1>
    <MunicipalityInput
      @selectedMunicipalityCode="handleSelectedMunicipality"
      @inputCleared="handleInputCleared"
    ></MunicipalityInput>
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
      <strong>{{ Number.parseFloat(roadLength / numberOfInhabitants).toFixed(2) }}</strong> meter bilvei per innbygger i kommunen.
    </p>
  </div>
</template>

<script>
import MunicipalityInput from "../src/components/MunicipalityInput";
import SsbApiService from "./SsbApiService";
import VegvesenApiService from "./VegvesenApiService";
const ssbApiService = new SsbApiService();
const vegvesenApiService = new VegvesenApiService();

export default {
  name: "app",
  components: {
    MunicipalityInput
  },
  methods: {
    handleSelectedMunicipality: function(municipalityCode) {
      this.loadingRoadLength = true;
      this.loadingInhabitants = true;
      ssbApiService.getNumberOfInhabitants(municipalityCode).then(response => {
        this.loadingInhabitants = false;
        this.numberOfInhabitants = response["value"][0];
      });
      vegvesenApiService.getLengthOfRoads(municipalityCode).then(length => {
        this.loadingRoadLength = false;
        this.roadLength = length;
      });
    },
    handleInputCleared: function() {
      this.numberOfInhabitants = null;
      this.roadLength = null;
    }
  },
  data: () => ({
    numberOfInhabitants: null,
    roadLength: null,
    loadingRoadLength: false,
    loadingInhabitants: false
  })
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#app h1 {
  margin-bottom: 1em;
}
</style>
