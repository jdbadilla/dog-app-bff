import { Axios } from "axios";
import { DogBreed, DogBreedDetails, RelatedSubBreed } from "./types/dog-breed";
import { flattenListOfDogBreeds } from "./helpers/flattenListOfDogBreeds";
import { calculateNumberOfPages } from "./helpers/calculateNumberOfPages";
import { extractRelatedSubBreeds } from "./helpers/extractRelatedSubBreeds";
import { getEntriesByPageNumberAndPageSize } from "./helpers/getEntriesByPageNumberAndPageSize";

export class DogBreedService {
  private dogBreedService = new Axios({ baseURL: "https://dog.ceo/api" });
  private allBreeds: DogBreed[] = [];
  constructor() {}

  /**
   * Fetch paginated breed data from Dog API, flatten the list, and cache it
   * */
  public getBreeds = async ({
    pageSize,
    pageNumber,
  }: {
    pageSize: number;
    pageNumber: number;
  }): Promise<{ numberOfPages: number; dogBreeds: DogBreed[] }> => {
    const request = await this.dogBreedService.get("/breeds/list/all");
    if (request.status !== 200) {
      throw new Error(
        `There was a problem fetching the list of all breeds. Status code: ${request.statusText}`
      );
    }

    const unflattenedBreedsArray = JSON.parse(request.data).message;
    const flattenedBreedsArray = flattenListOfDogBreeds(unflattenedBreedsArray);
    this.storeBreedsInCache(flattenedBreedsArray);

    return this.getBreedsFromCacheByPage({ pageSize, pageNumber });
  };

  /**
   * Retrieve breed details from the cache based on the provided ID
   * */
  public getBreedDetails = async ({
    breedId,
    numberOfImages = 1,
  }: {
    breedId: string;
    numberOfImages?: number;
  }): Promise<DogBreedDetails> => {
    const foundBreed = this.allBreeds.find((breed) => breed.id === breedId);
    if (!foundBreed) {
      throw new Error(
        `No breed found in the cache for the requested breed id: ${breedId}`
      );
    }

    const imageUrls = await this.getImageUrlsByBreed({
      breed: foundBreed,
      numberOfImages,
    });
    const relatedSubBreeds = await this.getRelatedSubBreedsByBreed(foundBreed);

    return {
      imageUrls,
      id: breedId,
      name: foundBreed.name,
      subBreedName: foundBreed.subBreedName,
      relatedSubBreeds,
    };
  };

  /**
   * Retrieves an image for a specific breed (taking sub-breed into account)
   * */
  private getImageUrlsByBreed = async ({
    breed,
    numberOfImages = 1,
  }: {
    breed: DogBreed;
    numberOfImages?: number;
  }): Promise<string[]> => {
    const imageRequestUrl = `/breed/${breed.name}/${
      breed.subBreedName ? `${breed.subBreedName}/` : ""
    }images/random/${numberOfImages}`;
    const imageRequest = await this.dogBreedService.get(imageRequestUrl);
    if (imageRequest.status !== 200) {
      throw new Error(
        `There was a problem fetching the image of breed with given id. Status code: ${imageRequest.status}`
      );
    }
    const imageUrls = JSON.parse(imageRequest.data).message;
    return imageUrls;
  };

  /**
   * Retrieves related sub-breeds for a specific breed
   * */
  private getRelatedSubBreedsByBreed = async (
    breed: DogBreed
  ): Promise<RelatedSubBreed[]> => {
    const subBreedRequestUrl = `/breed/${breed.name}/list`;
    const subBreedRequest = await this.dogBreedService.get(subBreedRequestUrl);
    if (subBreedRequest.status !== 200) {
      throw new Error(
        `There was a problem fetching the sub breeds of breed with given id. Status code: ${subBreedRequest.status}`
      );
    }
    const relatedSubBreedsNames = JSON.parse(subBreedRequest.data).message;
    const relatedSubBreedsWithId = extractRelatedSubBreeds({
      breeds: this.allBreeds,
      subBreedNames: relatedSubBreedsNames,
      breed,
    });

    const relatedSubBreedsWithSampleImage = await Promise.all(
      relatedSubBreedsWithId.map(async (relatedSubBreed) => {
        const imageUrls = await this.getImageUrlsByBreed({
          breed: {
            name: breed.name,
            subBreedName: relatedSubBreed.subBreedName,
            id: relatedSubBreed.id,
          },
          numberOfImages: 1,
        });
        return {
          ...relatedSubBreed,
          imageUrl: imageUrls[0],
        };
      })
    );

    return relatedSubBreedsWithSampleImage;
  };

  /**
   * Retrieves the paginated entries and calculates the number of pages
   */
  private getBreedsFromCacheByPage = ({
    pageSize,
    pageNumber,
  }: {
    pageSize: number;
    pageNumber: number;
  }) => ({
    numberOfPages: calculateNumberOfPages({
      totalNumberOfEntries: this.allBreeds.length,
      pageSize,
    }),
    dogBreeds: getEntriesByPageNumberAndPageSize({
      pageSize,
      pageNumber,
      entries: this.allBreeds,
    }),
  });

  private storeBreedsInCache = (flattenedBreedsArray: DogBreed[]) => {
    this.allBreeds = flattenedBreedsArray;
  };
}
