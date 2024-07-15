export interface DogBreed {
  id: string; // unique identifier
  name: string;
  subBreedName?: string;
}

export interface DogBreedDetails extends DogBreed {
  imageUrls: string[];
  relatedSubBreeds: RelatedSubBreed[];
}

interface RelatedSubBreed {
  id: string;
  subBreedName: string;
}
