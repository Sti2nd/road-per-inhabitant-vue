<template>
  <md-autocomplete
    v-model="selectedMunicipality"
    :md-options="municipalities"
    :md-open-on-focus="false"
    @md-selected="handleSelected"
    md-layout="box"
  >
    <label>Velg kommune</label>
    <template slot="md-autocomplete-item" slot-scope="{ item, term }">
      <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
    </template>
  </md-autocomplete>
</template>

<script>
import SsbApiService from "../SsbApiService";
const ssbApiService = new SsbApiService();

export default {
  name: "MunicipalityInput",
  props: {},
  data: () => ({
    municipalities: [],
    selectedMunicipality: null
  }),
  created: function() {
    ssbApiService
      .getSortedMunicipalityNames()
      .then(sortedMunicipalitesArray => {
        this.municipalities = sortedMunicipalitesArray;
      });
  },
  methods: {
    handleSelected: function(selectedMunicipality) {
    }
  }
};
</script>

<style scoped>
</style>
