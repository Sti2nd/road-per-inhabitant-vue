<template>
  <md-autocomplete
    v-model="selectedMunicipality"
    :md-options="municipalities"
    :md-open-on-focus="false"
    @md-selected="handleSelected"
    @md-changed="handleChangedInput"
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
  props: {
    municipalities: Array
  },
  data: () => ({
    selectedMunicipality: null
  }),
  methods: {
    /**
     * Emit selected municipality
     */
    handleSelected: function(selectedMunicipalityName) {
      ssbApiService.getMunicipalityCode(selectedMunicipalityName).then(code => {
        this.$emit("selectedMunicipality", {"code": code, "name": selectedMunicipalityName});
      });
    },
    /**
     * Emit when input is cleared
     */
    handleChangedInput: function(input) {
      if (this.selectedMunicipality !== null && input.length === 0){
        this.$emit("inputCleared");
      }
    }
  }
};
</script>

<style scoped>
</style>
