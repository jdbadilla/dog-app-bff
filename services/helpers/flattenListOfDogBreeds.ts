import { DogBreed } from "../types/dog-breed";

export const flattenListOfDogBreeds = (
  unflattenedBreedsArray: Record<string, string[]>
) => {
  const flattenedBreedsArray = Object.keys(unflattenedBreedsArray).reduce(
    (allBreeds: DogBreed[], currentBreed: string) => {
      const hasSubBreeds = unflattenedBreedsArray[currentBreed].length > 0;
      if (!hasSubBreeds) {
        const dogBreed = {
          name: currentBreed,
          id: getIdFromBreedAndSubBreed(currentBreed),
        };
        return [...allBreeds, dogBreed];
      } else {
        const subBreeds = unflattenedBreedsArray[currentBreed].map(
          (subBreed: string) => {
            return {
              name: currentBreed,
              subBreedName: subBreed,
              id: getIdFromBreedAndSubBreed(currentBreed, subBreed),
            };
          }
        );
        return [...allBreeds, ...subBreeds];
      }
    },
    []
  );

  return flattenedBreedsArray;
};

const getIdFromBreedAndSubBreed = (currentBreed: string, subBreed?: string) => {
  return `${currentBreed}${subBreed ? `-${subBreed}` : ""}`;
};
