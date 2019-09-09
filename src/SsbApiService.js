export default class SSBAPIService {
  constructor() {
    this.SSB_MUNICIPALITY_CODES_URL =
      "https://data.ssb.no/api/klass/v1/classifications/131/codes";
    this.SSB_MUNICIPALITY_INHABITANTS_URL =
      "https://data.ssb.no/api/v0/no/table/05231/";

    this.sortedMunicipalityNames = [];
    this.municipalityToCode = new Map();
  }

  /**
   * Get number of inhabitants in municipality
   * @param {string} municipalityCode SSB code for municipality
   */
  getNumberOfInhabitants(municipalityCode) {
    let year = "2018";
    let jsonQuery = {
      query: [
        {
          code: "Region",
          selection: {
            filter: "agg_single:KommNyeste",
            values: [municipalityCode]
          }
        },
        {
          code: "ContentsCode",
          selection: {
            filter: "item",
            values: ["Folkemengde"]
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: [year]
          }
        }
      ],
      response: {
        format: "json-stat2"
      }
    };
    return new Promise((resolve, reject) => {
      this._fetchNumInhabitantsFromServer(JSON.stringify(jsonQuery))
        .then(response => resolve(response["value"][0]))
        .catch(err => reject(err));
    });
  }

  /**
   *
   * @param {string} jsonQuery A JSON string query as defined by the API
   */
  _fetchNumInhabitantsFromServer(jsonQuery) {
    // To find API use https://data.ssb.no/api/v0/en/console/ and enter table
    // 05231.
    return new Promise((resolve, reject) => {
      fetch(this.SSB_MUNICIPALITY_INHABITANTS_URL, {
        method: "POST",
        body: jsonQuery
      })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  /**
   * Get official SSB municipality code by providing municipality name
   * @param {string} municipalityName
   */
  getMunicipalityCode(municipalityName) {
    return new Promise((resolve, reject) => {
      if (this.municipalityToCode.size === 0) {
        this._issueRequestForNamesAndCodes()
          .then(() => {
            resolve(this.municipalityToCode.get(municipalityName));
          })
          .catch(err => reject(err));
      } else {
        resolve(this.municipalityToCode.get(municipalityName));
      }
    });
  }

  /**
   * Return list of municipality names sorted ascending.
   */
  getSortedMunicipalityNames() {
    return new Promise((resolve, reject) => {
      if (this.sortedMunicipalityNames.length === 0) {
        this._issueRequestForNamesAndCodes()
          .then(newArray => {
            this.sortedMunicipalityNames = newArray;
            resolve(this.sortedMunicipalityNames);
          })
          .catch(err => reject(err));
      } else {
        resolve(this.sortedMunicipalityNames);
      }
    });
  }

  /**
   * Calls another function to request data and then handles the data.
   * @param {Array<string>} sortedMunicipalityNames An array with municipality names
   * sorted lexicographical
   */
  _issueRequestForNamesAndCodes() {
    return new Promise((resolve, reject) => {
      this._fetchMunicipalityInfo()
        .then(data => {
          let newArray = [];
          data["codes"].forEach(elementObj => {
            if (Number.parseInt(elementObj["code"]) !== 9999) {
              this.municipalityToCode.set(
                elementObj["name"],
                elementObj["code"]
              );
              newArray = this.insertIntoSortedArray(
                newArray,
                elementObj["name"]
              );
            }
          });
          resolve(newArray);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Request data from API
   */
  _fetchMunicipalityInfo = () => {
    // SSB documentation https://data.ssb.no/api/klass/v1/api-guide.html

    let currentYear = new Date().getFullYear();
    // TODO: Use current date and not only year?
    let fromQuery = "from=" + currentYear + "-01-01"; // required by the API
    let url = this.SSB_MUNICIPALITY_CODES_URL + "?" + fromQuery;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  };

  /**
   * Insert into an already sorted array
   * @param array A sorted array
   */
  insertIntoSortedArray(array, element) {
    let array2 = array.slice();
    // The following use "insertion sort" to insert and maintain order
    if (array2.length === 0) {
      array2.push(element);
      return array2;
    } else {
      for (let i = 0; i < array2.length; i++) {
        if (array2[i] < element) {
          if (i + 1 === array2.length) {
            array2.splice(i + 1, 0, element);
            return array2;
          }
          continue;
        } else {
          array2.splice(i, 0, element);
          return array2;
        }
      }
      return array2;
    }
  }
}
