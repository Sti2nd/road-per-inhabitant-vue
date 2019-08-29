<template>
  <div id="app">
    <MunicipalityInput @selectedMunicipalityCode="handleSelectedMunicipality" @inputCleared="handleInputCleared"></MunicipalityInput>
    <p v-if="numberOfInhabitants">har {{ numberOfInhabitants }} innbyggere</p>
  </div>
</template>

<script>
import MunicipalityInput from "../src/components/MunicipalityInput";
import SsbApiService from "./SsbApiService";
const ssbApiService = new SsbApiService();

export default {
  name: 'app',
  components: {
    MunicipalityInput
  },
  methods: {
    handleSelectedMunicipality: function(municipalityCode) {
      ssbApiService.getNumberOfInhabitants(municipalityCode).then(response => {
        this.numberOfInhabitants = response["value"][0];
      })
    },
    handleInputCleared: function() {
      this.numberOfInhabitants = null;
    }
  },
  data: () => ({
    numberOfInhabitants: null
  })
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
