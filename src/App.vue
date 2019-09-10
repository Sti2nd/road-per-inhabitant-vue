<template>
  <div id="app">
    <h1>Bilvei per innbygger</h1>
    <MunicipalityContainer :key="municipalityContainerKey" @connectionTrouble="showSnackbar = true"/>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showSnackbar">
      <span>Connection issues detected. Click the button to retry.</span>
      <md-button class="md-primary" @click="retryAllRequests">Retry</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import MunicipalityContainer from "./components/MunicipalityContainer";

export default {
  name: "app",
  components: {
    MunicipalityContainer
  },
  data: () => ({
    showSnackbar: false,
    municipalityContainerKey: 1
  }),
  methods: {
    retryAllRequests: function() {
      // eslint-disable-next-line no-undef
      logger.info("User clicked on 'retry' after connection issues");
      // Force MunicipalityContainer to update by changing its key
      this.municipalityContainerKey += 1;
      this.showSnackbar = false;
    }
  }
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
