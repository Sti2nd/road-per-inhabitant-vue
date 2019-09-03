import SsbApiService from "./SsbApiService";

describe("sorted municipality list by insertion", () => {
  test("elements are added into empty array", () => {
    const ssbApiService = new SsbApiService();
    let newArray = ssbApiService.insertIntoSortedArray([], "Bærum")
    expect(newArray).toEqual(["Bærum"]);
  });

})