export default class SSBAPIService {
  constructor() {
    this.SSB_MUNICIPALITY_CODES_URL =
      "https://data.ssb.no/api/klass/v1/classifications/131/codes";
    this.sortedMunicipalityNames = [];
    this.municipalityToCode = new Map();
  }

  /**
   * Return list of municipality names sorted ascending.
   */
  getSortedMunicipalityNames() {
    return new Promise((resolve, reject) => {
      if (this.sortedMunicipalityNames.length === 0) {
        this._fetchDataFromServer()
          .then(() => {
            resolve(this.sortedMunicipalityNames);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve(this.sortedMunicipalityNames);
      }
    });
  }

  _fetchDataFromServer() {
    return new Promise((resolve, reject) => {
      this._fetchMunicipalitiesAndCodes()
        .then(data => {
          data["codes"].forEach(elementObj => {
            this.municipalityToCode.set(elementObj["name"], elementObj["code"]);
            this.insertIntoSortedArray(
              this.sortedMunicipalityNames,
              elementObj["name"]
            );
            resolve("Success");
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Request data from API
   */
  _fetchMunicipalitiesAndCodes = () => {
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
      }).then(response => {
        response
          .json()
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  };

  /**
   * Insert into an already inserted array
   * @param array A sorted array
   */
  insertIntoSortedArray(array, element) {
    // The following use "insertion sort" to insert and maintain order
    if (array.length === 0) {
      array.push(element);
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i] < element) {
          if (i + 1 === array.length) {
            array.splice(i + 1, 0, element);
            break;
          }
          continue;
        } else {
          array.splice(i, 0, element);
          break;
        }
      }
    }
  }
}
