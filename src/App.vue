<template>
  <div id="app">
    <MunicipalityInput
      @selectedMunicipalityCode="handleSelectedMunicipality"
      @inputCleared="handleInputCleared"
    ></MunicipalityInput>
    <p v-show="numberOfInhabitants">har {{ numberOfInhabitants }} innbyggere</p>
    <p v-show="roadLength">og har {{ roadLength }} meter vei</p>
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
      ssbApiService.getNumberOfInhabitants(municipalityCode).then(response => {
        this.numberOfInhabitants = response["value"][0];
      });
      vegvesenApiService.getLengthOfRoads(municipalityCode).then(length => {
        this.roadLength = length;
      })
    },
    handleInputCleared: function() {
      this.numberOfInhabitants = null;
      this.roadLength = null;
    }
  },
  data: () => ({
    numberOfInhabitants: null,
    roadLength: null
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
</style>
