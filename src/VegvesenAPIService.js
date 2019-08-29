export default class VegvesenApiService {
  // https://api.vegdata.no/
  constructor() {
    this.ROAD_API_URL = "https://www.vegvesen.no/nvdb/api/v2/vegnett/lenker";
    // prettier-ignore
    this.headers = {
      "X-Client": "Stian Jørgensrud stianj@netcompany.no",
      // "X-Kontaktperson": "stianj@netcompany.no",
      "Accept": "application/vnd.vegvesen.nvdb-v2+json"
    };
  }

  /**
   * Returns the road length in metre of the provided municipality
   * @param {string} municipalityCode SSB municipality code
   */
  getLengthOfRoads(municipalityCode) {
    let url = this.ROAD_API_URL + "?kommune=" + municipalityCode;
    return new Promise((resolve, reject) => {
      this._fetchRoadsFromServer(url, this.headers).then(data => {
        let roadLength = 0;
        data.forEach(veilenke => {
          roadLength += veilenke["strekningslengde"]
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
