<template>
  <div id="app">
    <h1>Bilvei per innbygger</h1>
    <div id="municipalityContainer">
      <MunicipalityView v-for="number in numbers" :key="number" :municipalityNumber="number"></MunicipalityView>
    </div>
  </div>
</template>

<script>
import MunicipalityView from "./components/MunicipalityView";

export default {
  name: "app",
  components: {
    MunicipalityView
  },
  data: () => ({
    numbers: [1, 2]
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

#municipalityContainer {
  display: flex;
  flex-wrap: wrap;
}

.municipalityView {
  flex-grow: 1;
}
</style>
