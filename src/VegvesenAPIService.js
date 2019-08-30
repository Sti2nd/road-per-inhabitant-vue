export default class VegvesenApiService {
  // https://api.vegdata.no/
  // Dokumentasjon av felt https://datakatalogen.vegdata.no
  ROAD_API_URL = "https://www.vegvesen.no/nvdb/api/v2/vegnett/lenker";
  // prettier-ignore
  headers = {
    "X-Client": "Stian Jørgensrud stianj@netcompany.no",
    // "X-Kontaktperson": "stianj@netcompany.no",
    "Accept": "application/vnd.vegvesen.nvdb-v2+json"
  };

  // Dokumentasjon av det vi filtrerer på
  // https://api.vegdata.no/verdi/vegreferanse.html
  CATEGORY_CODE = {
    europaveg: "E",
    riksveg: "R",
    fylkesveg: "F",
    kommunal_veg: "K",
    privat_veg: "P",
    skogsbilveg: "S"
  };
  STATUS_CODE = {
    eksisterende_veg: "V",
    midlertidig_veg: "W",
    midlertidig_status_bilveg: "T",
    eksisterende_ferjestrekning: "S",
    gang_sykkelveg: "G",
    midlertidig_status_gang_sykkelveg: "U",
    beredskapsveg: "B",
    serviceveg: "M",
    rømningstunnel: "X",
    anleggsveg: "A",
    gang_sykkelveg_anlegg: "H",
    vedtatt_veg: "P",
    vedtatt_ferjestrekning: "E",
    vedtatt_gang_sykkelveg: "Q"
  };

  /**
   * Returns the road length in metre of the provided municipality
   * @param {string} municipalityCode SSB municipality code
   */
  getLengthOfRoads(municipalityCode) {
    let url = this.ROAD_API_URL + "?kommune=" + municipalityCode;
    return new Promise((resolve, reject) => {
      this._fetchRoadsFromServer(url, this.headers).then(data => {
        let roadLength = 0;
        data.forEach(roadlink => {
          let roadref = roadlink["vegreferanse"];
          if (
            "kategori" in roadref &&
            "status" in roadref &&
            roadref["kategori"] !== this.CATEGORY_CODE.privat_veg &&
            roadref["kategori"] !== this.CATEGORY_CODE.skogsbilveg &&
            roadref["status"] == this.STATUS_CODE.eksisterende_veg
          ) {
            roadLength += roadlink["strekningslengde"];
          }
        });
        resolve(roadLength);
      });
    });
  }

  /**
   * Fetch data from API
   * @param {string} url The road authority URL
   * @param {JSON} headers
   */
  _fetchRoadsFromServer(url, headers) {
    // Uses recursion to retrieve next page of data
    return new Promise((resolve, reject) => {
      let roads = [];
      fetch(url, {
        headers: headers
      }).then(result => {
        result.json().then(data => {
          if (data["metadata"]["returnert"] > 0) {
            roads.push(data["objekter"]);
            let nextUrl = data["metadata"]["neste"]["href"];
            // recurse
            this._fetchRoadsFromServer(nextUrl, headers).then(data => {
              // On the way back / unnesting
              // Push data received from further down the recursion
              roads.push(data);
              resolve(roads.flat(1));
            });
          } else {
            // At the bottom of the recursion
            resolve([]);
          }
        });
      });
    });
  }
}
