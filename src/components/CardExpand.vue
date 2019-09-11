<template>
  <md-card-expand>
    <md-card-actions>
      <md-card-expand-trigger>
        <md-button class="md-raised">Informasjon om tallene</md-button>
      </md-card-expand-trigger>
    </md-card-actions>
    <md-card-expand-content>
      <md-card-content>
        <p>
          Folketallet er fra inngangen til {{ inhabitantQuarter }}.
          kvartal {{ inhabitantYear }} og er hentet fra
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
</template>

<script>
export default {
  name: "CardExpand",
  props: {
    inhabitantYear: Number,
    inhabitantQuarter: Number
  }
}
</script>