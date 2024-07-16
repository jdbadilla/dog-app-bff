import { DogBreed } from "../types/dog-breed";
import crypto from "crypto";

export const flattenListOfDogBreeds = (
  unflattenedBreedsArray: Record<string, string[]>
) => {
  const flattenedBreedsArray = Object.keys(unflattenedBreedsArray).reduce(
    (allBreeds: DogBreed[], currentBreed: string) => {
      const hasSubBreeds = unflattenedBreedsArray[currentBreed].length > 0;
      if (!hasSubBreeds) {
        const dogBreed = { name: currentBreed, id: crypto.randomUUID() };
        return [...allBreeds, dogBreed];
      } else {
        const subBreeds = unflattenedBreedsArray[currentBreed].map(
          (subBreed: string) => {
            return {
              name: currentBreed,
              subBreedName: subBreed,
              id: crypto.randomUUID(),
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
