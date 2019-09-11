<template>
  <md-card class="municipalityView">
    <md-card-header>
      <h3 class="md-title">
        <!-- prettier-ignore-start -->
        <!-- Because we don't want a space between the colon and the municipalityNumber-->
        Kommune {{ municipalityNumber }}
        <span v-show="municipality.name">: {{ municipality.name }}</span>
        <!-- prettier-ignore-end -->
      </h3>
    </md-card-header>
    <md-card-content>
      <MunicipalityInput
        :municipalities="municipalities"
        @selectedMunicipality="handleSelectedMunicipality"
        @inputCleared="handleInputCleared"
      ></MunicipalityInput>
      <div class="municipalityInfo">
        <p
          class="md-body-1"
          v-show="municipality.numInhabitants"
        >har {{ municipality.numInhabitants }} innbyggere</p>
        <div v-show="loadingInhabitants == true">
          <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </div>
        <p
          class="md-body-1"
          v-show="municipality.roadLength"
        >og har {{ municipality.roadLength }} meter bilvei</p>
        <div v-show="loadingRoadLength == true">
          <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
        </div>
        <p v-show="municipality.numInhabitants && municipality.roadLength">
          som betyr at det er
          <strong>{{ Number.parseFloat(municipality.roadLength / municipality.numInhabitants).toFixed(2) }}</strong> meter bilvei
          <br />per innbygger i kommunen.
        </p>
      </div>
      <md-card-expand v-show="municipality.inhabitantYear">
        <md-card-actions>
          <md-card-expand-trigger>
            <md-button class="md-raised">Informasjon om tallene</md-button>
          </md-card-expand-trigger>
        </md-card-actions>
        <md-card-expand-content>
          <md-card-content>
            <p>
              Folketallet er fra inngangen til {{ municipality.inhabitantQuarter }}.
              kvartal {{ municipality.inhabitantYear }} og er hentet fra
              <a
                href="https://www.ssb.no"
                target="_blank"
              >SSB</a>.
            </p>
            <p>
              Antall meter vei er hentet fra
              <a
                href="https://www.vegvesen.no/fag/teknologi/nasjonal+vegdatabank"
                target="_blank"
              >NVDB</a>.
              Private veier og skogsveier er filtrert ut, og bare eksisterende veier blir summert. Se
              <a
                href="https://api.vegdata.no/verdi/vegreferanse.html"
                target="_blank"
              >
                dokumentasjonen på
                vegreferanser
              </a> under kategori og status for å se hva slags veier som ikke er med i
              beregningen.
            </p>
          </md-card-content>
        </md-card-expand-content>
      </md-card-expand>
      <div v-if="showMap" id="mapContainer">
        <l-map ref="myMap" :zoom="9" :bounds="mapBounds">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            :attribution="mapAttribution"
          />
          <l-geo-json ref="geojson" :geojson="municipality.polygon"></l-geo-json>
        </l-map>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import MunicipalityInput from "./MunicipalityInput";
import SsbApiService from "../SsbApiService";
import VegvesenApiService from "../VegvesenApiService";
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";

const ssbApiService = new SsbApiService();
const vegvesenApiService = new VegvesenApiService();

export default {
  name: "MunicipalityView",
  components: {
    MunicipalityInput,
    LMap,
    LTileLayer,
    LGeoJson
  },
  props: {
    municipalityNumber: Number,
    municipalities: Array
  },
  data: () => ({
    municipality: {
      name: null,
      code: null,
      numInhabitants: null,
      inhabitantYear: null,
      inhabitantQuarter: null,
      roadLength: null,
      polygon: null
    },
    loadingRoadLength: false,
    loadingInhabitants: false,
    mapAttribution:
      "Map data © <a href='https://openstreetmap.org' target='_blank'>OpenStreetMap</a> contributors",
    mapBounds: null,
    showMap: false
  }),
  methods: {
    handleSelectedMunicipality: function(municipalityObj) {
      this.loadingRoadLength = true;
      this.loadingInhabitants = true;
      this.municipality.name = municipalityObj["name"];
      this.municipality.code = municipalityObj["code"];
      ssbApiService
        .getNumberOfInhabitants(
          municipalityObj["code"],
          new Date().getFullYear()
        )
        .then(resultObj => {
          this.loadingInhabitants = false;
          this.municipality.numInhabitants = resultObj.numInhabitants;
          this.municipality.inhabitantYear = resultObj.year;
          this.municipality.inhabitantQuarter = resultObj.quarter;
        });
      vegvesenApiService
        .getLengthOfRoads(municipalityObj["code"])
        .then(length => {
          this.loadingRoadLength = false;
          this.municipality.roadLength = length;
        });
      vegvesenApiService
        .getMunicipalityCoordinates(municipalityObj["code"])
        .then(coordinates => {
          this.municipality.polygon = coordinates;
          this.showMap = true;
          this.$nextTick(() => {
            let bounds = this.$refs.geojson.mapObject.getBounds();
            this.$refs.myMap.mapObject.fitBounds(bounds);
          });
        });
    },
    handleInputCleared: function() {
      this.showMap = false;
      this.municipality.numInhabitants = null;
      this.municipality.roadLength = null;
      this.municipality.name = null;
      this.municipality.code = null;
      this.municipality.polygon = null;
      this.municipality.inhabitantYear = null;
    }
  }
};
</script>

<style scoped>
#mapContainer {
  height: 50%;
  height: 40vh;
}

.municipalityView {
  flex-grow: 1;
  min-width: 320px;
  max-width: 600px;
}

@media screen and (max-width: 712px) {
  .municipalityView {
    margin-bottom: 1em;
  }
}

@media screen and (min-width: 657px) {
  .municipalityView {
    margin-right: 1em;
    margin-left: 1em;
  }
}
</style>