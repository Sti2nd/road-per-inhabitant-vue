<template>
  <div id="municipalityContainer">
    <MunicipalityView
      :municipalities="municipalities"
      v-for="number in numbers"
      :key="number"
      :municipalityNumber="number"
    ></MunicipalityView>
  </div>
</template>

<script>
import MunicipalityView from "./MunicipalityView";
import SsbApiService from "../SsbApiService";
const ssbApiService = new SsbApiService();

export default {
  name: "MunicipalityContainer",
  components: {
    MunicipalityView
  },
  data: () => ({
    numbers: [1, 2],
    municipalities: [],
  }),  
  created: function() {
    ssbApiService
      .getSortedMunicipalityNames()
      .then(sortedMunicipalitesArray => {
        this.municipalities = sortedMunicipalitesArray;
      }).catch(err => {
        this.$emit("connectionTrouble");
      })
  },
};
</script>

<style scoped>
#municipalityContainer {
  display: flex;
  flex-wrap: wrap;
}

.municipalityView {
  flex-grow: 1;
}
</style>