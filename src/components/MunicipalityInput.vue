<template>
  <md-autocomplete v-model="selectedMunicipality" :md-options="municipalities" :md-open-on-focus="false">
    <label>Velg kommune</label>
  </md-autocomplete>
</template>

<script>
export default {
  name: 'MunicipalityInput',
  props: {
  },
  data: () => (
    {
      municipalities: ["Oslo", "Bærum", "Trondheim"],
      selectedMunicipality: null,
    }
  )
}
</script>

<style scoped>

</style>
