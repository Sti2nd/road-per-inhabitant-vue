import SsbApiService from "./SsbApiService";

describe("insertIntoSortedArray method", () => {
  const ssbApiService = new SsbApiService();

  it("adds an element into an empty array", () => {
    let newArray = ssbApiService.insertIntoSortedArray([], "Bærum");
    expect(newArray).toEqual(["Bærum"]);
  });

  describe("preserves the lexicographic sort order when it", () => {
    it("adds the element Asker into the array [Bærum]", () => {
      let newArray = ssbApiService.insertIntoSortedArray(["Bærum"], "Asker");
      expect(newArray).toEqual(["Asker", "Bærum"]);
    });

    it("adds the element Aremark into the array [Arendal]", () => {
      let newArray = ssbApiService.insertIntoSortedArray(
        ["Arendal"],
        "Aremark"
      );
      expect(newArray).toEqual(["Aremark", "Arendal"]);
    });

    it("adds the element Ålesund into the array [Asker, Bærum]", () => {
      let newArray = ssbApiService.insertIntoSortedArray(
        ["Asker", "Bærum"],
        "Ålesund"
      );
      expect(newArray).toEqual(["Asker", "Bærum", "Ålesund"]);
    });

    it("adds the element Gulen into the array [Asker, Ålesund]", () => {
      let newArray = ssbApiService.insertIntoSortedArray(
        ["Asker", "Ålesund"],
        "Gulen"
      );
      expect(newArray).toEqual(["Asker", "Gulen", "Ålesund"]);
    });
  });
});


describe("_issueRequestForNamesAndCodes method", () => {
  const ssbApiService = new SsbApiService();
  // mock depending function
  ssbApiService._fetchNamesAndCodes = jest.fn(() => {
    return new Promise(resolve => {
      resolve({
        codes: [
          {
            code: "0101",
            parentCode: null,
            level: "1",
            name: "Halden",
            shortName: "",
            presentationName: "",
            validFromInRequestedRange: "2019-01-01",
            validToInRequestedRange: null
          },
          {
            code: "5061",
            parentCode: null,
            level: "1",
            name: "Rindal",
            shortName: "",
            presentationName: "",
            validFromInRequestedRange: "2019-01-01",
            validToInRequestedRange: null
          },
          {
            code: "0104",
            parentCode: null,
            level: "1",
            name: "Moss",
            shortName: "",
            presentationName: "",
            validFromInRequestedRange: "2019-01-01",
            validToInRequestedRange: null
          },
          {
            code: "9999",
            parentCode: null,
            level: "1",
            name: "Uoppgitt",
            shortName: "",
            presentationName: "",
            validFromInRequestedRange: "2019-01-01",
            validToInRequestedRange: null
          }
        ]
      });
    });
  });
  const mock = jest.spyOn(ssbApiService, "_fetchNamesAndCodes");

  it("calls the _fetchNamesAndCodes method", () => {
    expect(mock).not.toBeCalled();
    ssbApiService._issueRequestForNamesAndCodes();
    expect(mock).toBeCalled();
    mock.mockClear();
  });

  it("doesn't include 'Uoppgitt' in the array", () => {
    expect.assertions(2);
    expect(mock).not.toBeCalled();
    return ssbApiService
      ._issueRequestForNamesAndCodes()
      .then(municipalityArray => {
        let arr = municipalityArray.filter(element => element === "Uoppgitt");
        expect(arr).not.toEqual(["Uoppgitt"]);
        mock.mockClear();
      });
  });

  it("returns a sorted array with municipality names", () => {
    expect.assertions(2);
    expect(mock).not.toBeCalled();
    return ssbApiService
      ._issueRequestForNamesAndCodes()
      .then(municipalityArray => {
        expect(municipalityArray).toEqual(["Halden", "Moss", "Rindal"]);
        mock.mockClear();
      });
  });
});

describe("getters for municipality names and codes:", () => {

  describe("getSortedMunicipalityNames method", () => {

    it("calls _issueRequestForNamesAndCodes", () => {
      const ssbApiService = new SsbApiService();
      // mock depending function
      ssbApiService._issueRequestForNamesAndCodes = jest.fn(() => {
        return new Promise(resolve => {
          resolve(["Asker", "Bærum"]);
        });
      });
      let mock = jest.spyOn(ssbApiService, "_issueRequestForNamesAndCodes");

      expect.assertions(2);
      expect(mock).toHaveBeenCalledTimes(0);
      return ssbApiService.getSortedMunicipalityNames().then(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        mock.mockClear();
      })
    });
  
    it("returns cached result on second call", () => {
      const ssbApiService = new SsbApiService();
      // mock depending function
      ssbApiService._issueRequestForNamesAndCodes = jest.fn(() => {
        return new Promise(resolve => {
          resolve(["Asker", "Bærum"]);
        });
      });
      let mock = jest.spyOn(ssbApiService, "_issueRequestForNamesAndCodes");

      expect.assertions(3);
      expect(mock).toHaveBeenCalledTimes(0);
      // first call
      return ssbApiService.getSortedMunicipalityNames().then(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        // second call
        return ssbApiService.getSortedMunicipalityNames();
      }).then(() => {
        // still only called API once
        expect(mock).toHaveBeenCalledTimes(1);
        mock.mockClear();
      });
    });
  })

  describe("getMunicipalityCode method", () => {

    it("calls _issueRequestForNamesAndCodes", () => {
      const ssbApiService = new SsbApiService();
      // mock depending function
      ssbApiService._issueRequestForNamesAndCodes = jest.fn(() => {
        return new Promise(resolve => {
          resolve(["Asker", "Bærum"]);
        });
      });
      let mock = jest.spyOn(ssbApiService, "_issueRequestForNamesAndCodes");

      expect.assertions(2);
      expect(mock).not.toBeCalled();
      return ssbApiService.getMunicipalityCode().then(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        mock.mockClear();
      });
    });

    it("returns cached result on second call", () => {
      const ssbApiService = new SsbApiService();
      // mock depending function
      ssbApiService._issueRequestForNamesAndCodes = jest.fn(() => {
        ssbApiService.municipalityToCode.set(0, "value");
        return new Promise(resolve => {
          resolve(["Asker", "Bærum"]);
        });
      });
      let mock = jest.spyOn(ssbApiService, "_issueRequestForNamesAndCodes");

      expect.assertions(3);
      expect(mock).toHaveBeenCalledTimes(0);
      // first call
      return ssbApiService.getMunicipalityCode().then(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        // second call
        return ssbApiService.getMunicipalityCode();
      }).then(() => {
        // still only called API once
        expect(mock).toHaveBeenCalledTimes(1);
        mock.mockClear();
      });
    });
  });
})

describe("getNumberOfInhabitants method", () => {
  const ssbApiService = new SsbApiService();
  ssbApiService._fetchNumberOfInhabitants = jest.fn(() => {
    return new Promise(resolve => {
      resolve(
        {
          "class": "dataset",
          "label": "05231: Beregnet folkemengde, etter region, statistikkvariabel og år",
          "source": "Statistisk sentralbyrå",
          "updated": "2018-12-18T07:00:00Z",
          "id": ["Region", "ContentsCode", "Tid"],
          "value": [2345],
          "role": { "time": ["Tid"], "metric": ["ContentsCode"], "geo": ["Region"] },
          "version": "2.0"
        }
      );
    });
  });
  let mock = jest.spyOn(ssbApiService, "_fetchNumberOfInhabitants");

  it("returns a number", () => {
    expect.assertions(2);
    expect(mock).not.toBeCalled();
    return ssbApiService.getNumberOfInhabitants("1411", 2019).then(result => {
      expect(typeof result == 'number').toBeTruthy();
    });
  })
});