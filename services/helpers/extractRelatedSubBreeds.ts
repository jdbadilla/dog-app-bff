import { DogBreed } from "../types/dog-breed";

export const extractIdsForSubBreedsByBreed = ({
  breeds,
  subBreedNames,
  breed,
}: {
  breeds: DogBreed[];
  subBreedNames: string[];
  breed: DogBreed;
}) => {
  const subBreedsWithId = subBreedNames
    .filter((subBreed: string) => subBreed !== breed.subBreedName)
    .map((subBreed: string) => {
      const foundSubBreed = breeds.find(
        (breedFromCache) =>
          breedFromCache.subBreedName === subBreed &&
          breedFromCache.name === breed.name
      );

      if (!foundSubBreed) {
        throw new Error(
          `No sub breed found for the requested breed id: ${breed.id}`
        );
      }

      return {
        id: foundSubBreed?.id,
        subBreedName: subBreed,
      };
    });

  return subBreedsWithId;
};
