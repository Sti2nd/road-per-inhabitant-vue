<template>
  <div id="cardContainer">
    <MunicipalityCard
      :municipalities="municipalities"
      v-for="number in numbers"
      :key="number"
      :municipalityNumber="number"
      @removeMe="removeMunicipalityCard"
    ></MunicipalityCard>
    <div id="addCardButtonContainer">
      <md-button class="md-fab md-primary" @click="addMunicipalityCard">
        <md-icon :md-src="require('../assets/plus_sign.svg')" class="md-size-2x" />
        <md-tooltip md-direction="top">
          <big>Add new municipality card</big>
        </md-tooltip>
      </md-button>
    </div>
  </div>
</template>

<script>
import MunicipalityCard from "./MunicipalityCard";
import SsbApiService from "../SsbApiService";
import { reject } from "q";
const ssbApiService = new SsbApiService();

export default {
  name: "MunicipalityContainer",
  components: {
    MunicipalityCard
  },
  data: () => ({
    numbers: [1, 2],
    municipalities: []
  }),
  created: function() {
    ssbApiService
      .getSortedMunicipalityNames(new Date().getFullYear())
      .then(sortedMunicipalitesArray => {
        this.municipalities = sortedMunicipalitesArray;
      })
      .catch(err => {
        // eslint-disable-next-line no-undef
        logger.error("Could not retrieve sorted municipalities on page load");
        // eslint-disable-next-line no-undef
        logger.trace(
          "This logger is too simple, it doesn't support stack trace"
        );
        this.$emit("connectionTrouble");
        reject(err);
      });
  },
  methods: {
    addMunicipalityCard: function() {
      if (this.numbers.length === 0){
        this.numbers.push(1);
      } else {
        let largestNumber = this.numbers[this.numbers.length-1];
        this.numbers.push(largestNumber + 1);
      }
    },
    removeMunicipalityCard: function(municipalityNumber) {
      let index = this.numbers.indexOf(municipalityNumber);
      this.numbers.splice(index, 1);
    }
  }
};
</script>

<style scoped>
#cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

#addCardButtonContainer {
  width: 100%;
  height: 5em;
  padding: 1em;
}
</style>