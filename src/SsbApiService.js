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
   * Get number of inhabitants in municipality. Returns an object that includes 
   * numInhabitants key
   * @param {string} municipalityCode SSB code for municipality
   * @param {number} year The year for which to retrieve information
   */
  getNumberOfInhabitants(municipalityCode, year) {
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
      this._fetchNumberOfInhabitants(JSON.stringify(jsonQuery))
        .then(response => {
          let responseObj = {
            municipalityCode: municipalityCode,
            numInhabitants: response["value"][0],
            year: year
          }
          resolve(responseObj);
        })
        .catch(err => reject(err));
    });
  }

  /**
   *
   * @param {string} jsonQuery A JSON string query as defined by the API
   */
  _fetchNumberOfInhabitants(jsonQuery) {
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
    let currentYear = new Date().getFullYear();
    return new Promise((resolve, reject) => {
      if (this.municipalityToCode.size === 0) {
        this._issueRequestForNamesAndCodes(currentYear)
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
   * @param {number} year The year for which to retrieve information
   */
  getSortedMunicipalityNames(year) {
    return new Promise((resolve, reject) => {
      if (this.sortedMunicipalityNames.length === 0) {
        this._issueRequestForNamesAndCodes(year)
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
   * @param {number} year The year for which to retrieve data
   */
  _issueRequestForNamesAndCodes(year) {
    return new Promise((resolve, reject) => {
      this._fetchNamesAndCodes(year)
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
   * @param year The year for which to retrieve data
   */
  _fetchNamesAndCodes = (year) => {
    // SSB documentation https://data.ssb.no/api/klass/v1/api-guide.html
    let fromQuery = "from=" + year + "-01-01"; // required by the API
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
