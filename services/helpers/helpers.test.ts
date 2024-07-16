import { calculateNumberOfPages } from "./calculateNumberOfPages";
import { getEntriesByPageNumberAndPageSize } from "./getEntriesByPageNumberAndPageSize";
import { extractRelatedSubBreeds } from "./extractRelatedSubBreeds";
import { flattenListOfDogBreeds } from "./flattenListOfDogBreeds";

test("flattenListOfDogBreeds", () => {
  const unflattenedDogBreeds = {
    affenpinscher: [],
    african: [],
    australian: ["kelpie", "shepherd"],
    bakharwal: ["indian"],
  };

  const result = flattenListOfDogBreeds(unflattenedDogBreeds);
  expect(result).toEqual([
    { name: "affenpinscher", id: "affenpinscher" },
    { name: "african", id: "african" },
    { name: "australian", subBreedName: "kelpie", id: "australian-kelpie" },
    { name: "australian", subBreedName: "shepherd", id: "australian-shepherd" },
    { name: "bakharwal", subBreedName: "indian", id: "bakharwal-indian" },
  ]);
});

test("calculateNumberOfPages", () => {
  const result = calculateNumberOfPages({
    totalNumberOfEntries: 101,
    pageSize: 10,
  });
  expect(result).toBe(11);
});

test("getEntriesByPageNumberAndPageSize", () => {
  const entries = new Array(33).fill(0).map((_, idx) => ({ value: idx + 1 }));

  const result = getEntriesByPageNumberAndPageSize({
    entries,
    pageSize: 10,
    pageNumber: 4,
  });
  expect(result).toEqual([{ value: 31 }, { value: 32 }, { value: 33 }]);
});

test("extractRelatedSubBreeds", () => {
  const result = extractRelatedSubBreeds({
    subBreedNames: ["kelpie"],
    breed: {
      name: "australian",
      subBreedName: "shepherd",
      id: "shepherd-australian",
    },
    breeds: [
      { name: "australian", subBreedName: "kelpie", id: "australian-kelpie" },
      {
        name: "australian",
        subBreedName: "shepherd",
        id: "australian-shepherd",
      },
    ],
  });
  expect(result).toEqual([{ subBreedName: "kelpie", id: "australian-kelpie" }]);
});
