<template>
  <div id="app">
    <div class="headlineSection">
      <h1 class="md-display-2">Bilvei per innbygger</h1>
      <h3 class="md-title">Sammenlign mengden vei i forskjellige kommuner</h3>
    </div>
    <CardContainer :key="cardContainerKey" @connectionTrouble="showSnackbar = true"/>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showSnackbar">
      <span>Connection issues detected. Click the button to retry.</span>
      <md-button class="md-primary" @click="retryAllRequests">Retry</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import CardContainer from "./components/CardContainer";

export default {
  name: "app",
  components: {
    CardContainer
  },
  data: () => ({
    showSnackbar: false,
    cardContainerKey: 1
  }),
  methods: {
    retryAllRequests: function() {
      // eslint-disable-next-line no-undef
      logger.info("User clicked on 'retry' after connection issues");
      // Force MunicipalityContainer to update by changing its key
      this.cardContainerKey += 1;
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
}

#app h1 {
  margin-bottom: 1em;
  margin-top: 1em;
}

.headlineSection {
  margin: 3em 1em 3em 1em;
}
</style>
