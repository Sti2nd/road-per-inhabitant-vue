import proj4 from "proj4";
import { Geometry } from "wkx";

export default class VegvesenApiService {
  // https://api.vegdata.no/
  // Dokumentasjon av felt https://datakatalogen.vegdata.no
  ROAD_API_URL = "https://www.vegvesen.no/nvdb/api/v2/vegnett/lenker";
  MUNICIPALITY_REGION_API_URL =
    "https://www.vegvesen.no/nvdb/api/v2/omrader/kommuner";
  // prettier-ignore
  HEADERS = {
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
      this._fetchRoadsFromServer(url, this.HEADERS)
        .then(data => {
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
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Fetch road data from API
   * @param {string} url The road authority URL
   * @param {JSON} headers
   */
  _fetchRoadsFromServer(url, headers) {
    // Uses recursion to retrieve all pages of data
    return new Promise((resolve, reject) => {
      let roads = [];
      fetch(url, {
        headers: headers
      })
        .then(result => result.json())
        .then(data => {
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
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Returns Promise that resolves a GeoJSON
   * @param {number} municipalityCode Official SSB municipality code
   */
  getMunicipalityCoordinates(municipalityCode) {
    return new Promise((resolve, reject) => {
      this._getMunicipalityURL(municipalityCode, this.HEADERS)
        .then(url => this._fetchMunicipalityShape(url))
        .then(polygonWkt => {
          // Define the coordinate systems using proj.4 strings
          let fromCoordinateSystem =
            "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +vunits=m +no_defs";
          let toCoordinateSystem =
            "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
          // Get municipality shape
          let geom = Geometry.parse(polygonWkt);
          let polygonGeojson = geom.toGeoJSON();
          // Transform coordinates
          for (let i = 0; i < polygonGeojson.coordinates[0].length; i++) {
            let coordinates = polygonGeojson.coordinates[0][i];
            let transformedCoordinates = proj4(
              fromCoordinateSystem,
              toCoordinateSystem,
              coordinates
            );
            polygonGeojson.coordinates[0][i] = transformedCoordinates;
          }
          resolve(polygonGeojson);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Returns Promise that resolves the WKT (well known text) of the municipality shape
   * @param {string} url Endpoint
   */
  _fetchMunicipalityShape(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(result => result.json())
        .then(data => resolve(data["geometri"]["wkt"]))
        .catch(err => reject(err));
    });
  }

  /**
   * Returns the URL that can be used to retrieve information about a
   * municipality stored at the Norwegian road authority.
   * @param {number} municipalityCode Official SSB municipality code
   */
  _getMunicipalityURL(municipalityCode, headers) {
    return new Promise((resolve, reject) => {
      fetch(this.MUNICIPALITY_REGION_API_URL + "?inkluder=vegobjekt", {
        headers: headers
      })
        .then(result => result.json())
        .then(data => {
          data.forEach(municipality => {
            if (municipality["nummer"] == municipalityCode) {
              resolve(municipality["vegobjekt"]["href"]);
            }
          });
          reject("Could not find the municipality");
        })
        .catch(err => reject(err));
    });
  }
}
