import { Axios } from "axios";
import { DogBreed, DogBreedDetails } from "./types/dog-breed";
import crypto from "crypto";

export class DogBreedService {
  private dogBreedService = new Axios({
    baseURL: "https://dog.ceo/api",
  });
  private allBreeds: DogBreed[] = [];

  constructor() {}

  public getAllBreeds = async ({
    limit,
    pageNumber,
  }: {
    limit: number;
    pageNumber: number;
  }): Promise<{ numberOfPages: number; dogBreeds: DogBreed[] }> => {
    // return breeds if they have already been cached
    if (this.allBreeds.length !== 0) {
      return {
        numberOfPages: this.getNumberOfPagesByLimit(limit),
        dogBreeds: this.getBreedsByPageNumberAndLimit({ limit, pageNumber }),
      };
    }

    const request = await this.dogBreedService.get("/breeds/list/all");

    if (request.status !== 200) {
      throw new Error(
        `There was a problem fetching the list of all breeds. Status code: ${request.statusText}`
      );
    }

    const unflattenedBreedsArray = JSON.parse(request.data).message;

    const flattenedBreedsArray = this.flattenListOfDogBreeds(
      unflattenedBreedsArray
    );

    // store flattened dog breeds in the cache
    this.allBreeds = flattenedBreedsArray;

    return {
      numberOfPages: this.getNumberOfPagesByLimit(limit),
      dogBreeds: this.getBreedsByPageNumberAndLimit({ limit, pageNumber }),
    };
  };

  public getBreedDetails = async (
    breedId: string
  ): Promise<DogBreedDetails> => {
    const foundBreed = this.allBreeds.find((breed) => breed.id === breedId);
    if (!foundBreed) {
      throw new Error(`No breed found for the requested breed id: ${breedId}`);
    }

    const imageUrl = await this.getImageUrlByBreed(foundBreed);
    const relatedSubBreeds = await this.getRelatedSubBreedsByBreed(foundBreed);

    return {
      imageUrl,
      id: breedId,
      name: foundBreed.name,
      subBreedName: foundBreed.subBreedName,
      relatedSubBreeds,
    };
  };

  private getBreedsByPageNumberAndLimit = ({
    limit,
    pageNumber,
  }: {
    limit: number;
    pageNumber: number;
  }) => {
    const start = 0 + (pageNumber - 1) * limit;
    const end = limit * pageNumber;
    return this.allBreeds.slice(start, end);
  };

  /** Retrieves an image with the exact breed (taking sub-breed into account) */
  private getImageUrlByBreed = async (breed: DogBreed) => {
    const imageRequestUrl = `/breed/${breed.name}/${
      breed.subBreedName ? `${breed.subBreedName}/` : ""
    }images/random`;
    const imageRequest = await this.dogBreedService.get(imageRequestUrl);
    if (imageRequest.status !== 200) {
      throw new Error(
        `There was a problem fetching the image of breed with given id. Status code: ${imageRequest.status}`
      );
    }
    const imageUrl = JSON.parse(imageRequest.data).message;
    return imageUrl;
  };

  private getRelatedSubBreedsByBreed = async (breed: DogBreed) => {
    const subBreedRequestUrl = `/breed/${breed.name}/list`;
    const subBreedRequest = await this.dogBreedService.get(subBreedRequestUrl);
    if (subBreedRequest.status !== 200) {
      throw new Error(
        `There was a problem fetching the sub breeds of breed with given id. Status code: ${subBreedRequest.status}`
      );
    }
    const relatedSubBreedsData = JSON.parse(subBreedRequest.data).message;
    const relatedSubBreeds = relatedSubBreedsData
      .filter((subBreed: string) => subBreed !== breed.subBreedName)
      .map((subBreed: string) => {
        const foundSubBreed = this.allBreeds.find(
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
    return relatedSubBreeds;
  };

  private flattenListOfDogBreeds = (
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

  /**
   * Retrieves the number of pages given a particular limit for # of results shown
   */
  private getNumberOfPagesByLimit = (limit: number) => {
    return Math.ceil(this.allBreeds.length / limit);
  };
}
