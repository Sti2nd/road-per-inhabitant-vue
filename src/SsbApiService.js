import Logger from "js-logger";

export default class SSBAPIService {
  constructor() {
    this.SSB_MUNICIPALITY_CODES_URL =
      "https://data.ssb.no/api/klass/v1/classifications/131/codes";
    this.SSB_MUNICIPALITY_INHABITANTS_URL =
      "https://data.ssb.no/api/v0/no/table/01222/";

    this.sortedMunicipalityNames = [];
    this.municipalityToCode = new Map();
  }

  /**
   * Get number of inhabitants in municipality. Returns an object that includes
   * numInhabitants key
   * @param {string} municipalityCode SSB code for municipality
   */
  getNumberOfInhabitants(municipalityCode) {
    let [year, quarter, quarterString] = this._getCurrentQuarter();
    let jsonQuery = this._getJSONQueryForNumInhabitants(
      municipalityCode,
      quarterString
    );

    return new Promise((resolve, reject) => {
      this._fetchNumberOfInhabitants(JSON.stringify(jsonQuery))
        .then(response => {
          let responseObj = this._createResponseObject(
            municipalityCode,
            response,
            year,
            quarter
          );
          resolve(responseObj);
        })
        .catch(() => {
          Logger.info(
            "One 404 error as expected... SSB hasn't published data on current quarter, " +
              "so getting last quarter instead"
          );
          // Usually SSB doesn't have data for this quarter so try last quarter!
          let [newJsonQuery, newYear, newQuarter] = this._getJsonQueryForPreviousQuarter(
            jsonQuery,
            year,
            quarter
          );
          this._fetchNumberOfInhabitants(JSON.stringify(newJsonQuery))
            .then(response => {
              let responseObj = this._createResponseObject(
                municipalityCode,
                response,
                newYear,
                newQuarter
              );
              resolve(responseObj);
            })
            .catch(err => reject(err));
        });
    });
  }

  /**
   *
   * @param {string} jsonQuery A JSON string query as defined by the API
   */
  _fetchNumberOfInhabitants(jsonQuery) {
    // To find API use https://data.ssb.no/api/v0/en/console/ and enter table
    // 01222.
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
  _fetchNamesAndCodes = year => {
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

  /**
   * Returns year, quarter and quarterString for the quarter before the given
   * @param {number} currentYear
   * @param {number} currentQuarter
   */
  _getPreviousQuarter(currentYear, currentQuarter) {
    let year = currentYear;
    let quarter = currentQuarter;
    if (quarter > 1) {
      quarter = quarter - 1;
    } else if (quarter === 0) {
      quarter = 4;
      year = year - 1;
    }
    let quarterString = year + "K" + quarter;
    return [year, quarter, quarterString];
  }

  /**
   * Returns year, quarter and quarterString
   */
  _getCurrentQuarter() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let quarter = null;
    let month = currentDate.getMonth();
    if (month < 3) {
      quarter = 1;
    } else if (month < 6) {
      quarter = 2;
    } else if (month < 9) {
      quarter = 3;
    } else if (month < 12) {
      quarter = 4;
    }
    let quarterString = year + "K" + quarter;
    return [year, quarter, quarterString];
  }

  /**
   * Return an object with municipalityCode, numInhabitants, year and quarter
   * @param {string} municipalityCode Official SSB municipality code
   * @param {JSON} response The JSON retrieved from SSb
   * @param {number} year
   * @param {number} quarter
   */
  _createResponseObject(municipalityCode, response, year, quarter) {
    return {
      municipalityCode: municipalityCode,
      numInhabitants: response["value"][0],
      year: year,
      quarter: quarter
    };
  }

  /**
   * Returns an object to be used as JSON query.
   */
  _getJSONQueryForNumInhabitants(municipalityCode, quarterString) {
    return {
      query: [
        {
          code: "Region",
          selection: {
            filter: "item",
            values: [municipalityCode]
          }
        },
        {
          code: "ContentsCode",
          selection: {
            filter: "item",
            values: ["Folketallet1"]
          }
        },
        {
          code: "Tid",
          selection: {
            filter: "item",
            values: [quarterString]
          }
        }
      ],
      response: {
        format: "json-stat2"
      }
    };
  }

  /**
   * Returns JSON query, year and quarter for the previous quarter.
   * @param {JSON} jsonQuery JSON query as defined by the API
   */
  _getJsonQueryForPreviousQuarter(jsonQuery, year, quarter) {
    let newJsonQuery = JSON.parse(JSON.stringify(jsonQuery));
    let [newYear, newQuarter, newQuarterString] = this._getPreviousQuarter(
      year,
      quarter
    );
    let newQuery = newJsonQuery.query.filter(e => e.code !== "Tid");
    newQuery.push({
      code: "Tid",
      selection: {
        filter: "item",
        values: [newQuarterString]
      }
    });
    newJsonQuery.query = newQuery;
    return [newJsonQuery, newYear, newQuarter]
  }
}
