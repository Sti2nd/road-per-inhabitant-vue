<template>
  <div id="cardContainer">
    <MunicipalityCard
      :municipalities="municipalities"
      v-for="number in numbers"
      :key="number"
      :municipalityNumber="number"
    ></MunicipalityCard>
  </div>
</template>

<script>
import MunicipalityCard from "./MunicipalityCard";
import SsbApiService from "../SsbApiService";
import { reject } from 'q';
const ssbApiService = new SsbApiService();

export default {
  name: "MunicipalityContainer",
  components: {
    MunicipalityCard
  },
  data: () => ({
    numbers: [1, 2],
    municipalities: [],
  }),  
  created: function() {
    ssbApiService
      .getSortedMunicipalityNames(new Date().getFullYear())
      .then(sortedMunicipalitesArray => {
        this.municipalities = sortedMunicipalitesArray;
      }).catch(err => {
        // eslint-disable-next-line no-undef
        logger.error("Could not retrieve sorted municipalities on page load");
        // eslint-disable-next-line no-undef
        logger.trace("This logger is too simple, it doesn't support stack trace");
        this.$emit("connectionTrouble");
        reject(err);
      })
  },
};
</script>

<style scoped>
#cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>