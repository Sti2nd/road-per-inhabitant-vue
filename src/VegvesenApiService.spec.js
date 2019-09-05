import VegvesenApiService from "./VegvesenApiService";
import { exec } from "child_process";

describe("getMunicipalityCoordinates method", () => {
  const vegvesenApiService = new VegvesenApiService();
  vegvesenApiService._getMunicipalityURL = jest.fn(() => {
    return new Promise(resolve => {
      resolve("someUrlButThisIsForTestPurposesSoItCanBeAnything");
    });
  });
  vegvesenApiService._fetchMunicipalityShape = jest.fn(() => {
    return new Promise(resolve => {
      resolve(
        "POLYGON ((-92079.54 6636303.79, -96094.59 6628403.64, -96431.2 6627711.65, " +
          "-96834.11 6626792.17, -97826.53 6624381, -98168.34 6623497.7," +
          " -98489.35 6622546.5, -98767.23 6621581.82, -99001.45 6620605.6," +
          " -99191.48 6619619.84, -99336.97 6618626.52, -99437.62 6617627.65," +
          " -99493.22 6616625.27, -99540.58 6615186.27, -99551.21 6614200.54," +
          " -99517.28 6613197.19, -99438.22 6612196.38, -99314.22 6611200.15," +
          " -99145.52 6610210.51, -98932.45 6609229.46, -98675.46 6608259," +
          " -98375.07 6607301.09, -98031.88 6606357.66, -97646.59 6605430.64," +
          " -97579.02 6605277.86, -97276.76 6604623.24, -96821.01 6603728.77," +
          " -96325.47 6602855.72, -95791.16 6602005.85, -95219.16 6601180.89," +
          " -94610.64 6600382.51, -93966.79 6599612.32, -93288.96 6598871.89," +
          " -88042.44 6593394.68, -85546.04 6595785.59, -79571.91 6601507.28," +
          " -79524.22 6601552.95, -77309.16 6603674.42, -75893.01 6605030.73," +
          " -73274.92 6607538.2, -72240.62 6608528.82, -71931.72 6608824.67," +
          " -66419.22 6615739.85, -72199.82 6626186.29, -72201.36 6626187.34," +
          " -73855.81 6627029.33, -78833.45 6629562.56, -92079.54 6636303.79))"
      );
    });
  });
  let mock__getMunicipalityURL = jest.spyOn(
    vegvesenApiService,
    "_getMunicipalityURL"
  );
  let mock_fetchMunicipalityShape = jest.spyOn(
    vegvesenApiService,
    "_fetchMunicipalityShape"
  );

  let transformed_geojson =
    '{"type":"Polygon","coordinates":[[[4.531235566284958,59.44429903786102],' +
    '[4.483511749192496,59.36888980453196],[4.47960168213492,59.36230529925927],' +
    '[4.475175356383635,59.353618647934525],[4.464686091074233,59.330929682168566],' +
    '[4.461222338072242,59.3226485057951],[4.458306943154061,59.313797220677635],' +
    '[4.456174707789258,59.30488785942403],[4.454828802330965,59.29593832022983],' +
    '[4.454272222393002,59.28696701638477],[4.454504909068395,59.27799191558686],' +
    '[4.455525861221556,59.269031165168485],[4.457332451316391,59.26010303581599],' +
    '[4.460483303703154,59.24733170717506],[4.463015859929409,59.23861392244349],' +
    '[4.466363022098365,59.22980335361691],[4.470478495422983,59.22107871612095],' +
    '[4.475352855120141,59.212457664081285],[4.480975934195717,59.20395750503255],' +
    '[4.4873360841488426,59.19559532106839],[4.494419636097323,59.187388016085436],' +
    '[4.502211875600148,59.179352034266905],[4.510696846583986,59.17150343555769],' +
    '[4.519856928676774,59.16385813387901],[4.5214361848691205,59.16260376588046],' +
    '[4.528420582782551,59.1572467470347],[4.538695195544784,59.14998606959278],' +
    '[4.549590958741603,59.14296926524819],[4.561085443361133,59.136210290357],' +
    '[4.573155335336748,59.12972275378045],[4.585776001943292,59.12351961161304],' +
    '[4.5989226941277614,59.117613266307565],[4.612568086435219,59.1120155498844],' +
    '[4.7173580317342045,59.0708783018816],[4.753840081155908,59.09543342005082],' +
    '[4.841355886610839,59.154160337149975],[4.84205571502328,59.15462889198071],' +
    '[4.874581033675518,59.176390354314],[4.895396930879191,59.1902993322482],' +
    '[4.933924351918947,59.21600586186527],[4.9491607697244975,59.22615892308412],' +
    '[4.9537129761365915,59.229190855410344],[5.030812532585337,59.29774018539925],' +
    '[4.903226812736704,59.38233634334454],[4.903197338458744,59.38234353991067],' +
    '[4.872287745165747,59.38754221333789],[4.779238637545493,59.403136973115195],' +
    '[4.531235566284958,59.44429903786102]]]}';

  it("should return a transformed Polygon GeoJSON in EPSG:4326", () => {
    expect.assertions(5);
    expect(mock__getMunicipalityURL).not.toBeCalled();
    expect(mock_fetchMunicipalityShape).not.toBeCalled();
    return vegvesenApiService.getMunicipalityCoordinates().then(geojson => {
      expect(mock__getMunicipalityURL).toHaveBeenCalledTimes(1);
      expect(mock_fetchMunicipalityShape).toHaveBeenCalledTimes(1);
      expect(geojson).toEqual(JSON.parse(transformed_geojson));
    });
  });
});

describe("getLengthOfRoads method", () => {
  let vegvesenApiService = new VegvesenApiService();
  vegvesenApiService._fetchRoadsFromServer = jest.fn(() => {
    return new Promise(resolve => {
      resolve([
        {
          "felt": "1#2",
          "vegreferanse": {
            "kategori": "K",
            "status": "V"
          },
          "strekningslengde": 3
        },
        {
          "felt": "1",
          "vegreferanse": {
            "kategori": "F",
            "status": "V"
          },
          "strekningslengde": 7
        },
        {
          "felt": "1#2",
          "vegreferanse": {
            "kategori": "P",
            "status": "V"
          },
          "strekningslengde": 2
        },
        {
          "felt": "1",
          "vegreferanse": {
            "kategori": "S",
            "status": "V"
          },
          "strekningslengde": 11
        },
        {
          "felt": "1",
          "vegreferanse": {
            "kategori": "F",
            "status": "S"
          },
          "strekningslengde": 17
        }
      ]);
    })
  })

  let mock = jest.spyOn(vegvesenApiService, "_fetchRoadsFromServer");

  it("returns a number", () => {
    expect.assertions(2);
    return vegvesenApiService.getLengthOfRoads().then(roadLength => {
      expect(mock).toBeCalled();
      expect(typeof roadLength).toBe("number");
    })
  });

  it("sum up only roads with status='V' and excludes roads with kategori='P' and 'S'", () => {
    expect.assertions(2);
    return vegvesenApiService.getLengthOfRoads().then(roadLength => {
      expect(mock).toBeCalled();
      expect(roadLength).toBe(10);
    })
  })
})