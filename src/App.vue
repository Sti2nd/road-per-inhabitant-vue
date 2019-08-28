<template>
  <div id="app">
    <MunicipalityInput></MunicipalityInput>
  </div>
</template>

<script>
import MunicipalityInput from "../src/components/MunicipalityInput";

export default {
  name: 'app',
  components: {
    MunicipalityInput
  }
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
