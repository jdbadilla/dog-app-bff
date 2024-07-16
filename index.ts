import express from "express";
import cors from "cors";
import { DogBreedService } from "./services/dog-breeds";

const app = express();
const port = 3000;

app.use(cors());

const dogBreedService = new DogBreedService();

app.get("/breeds/list/all", async (req, res) => {
  const pageSize = Number(req.query.size); // the number of results that should be shown
  const pageNumber = Number(req.query.page); // the page number for the number of results that should be shown
  if (!pageSize || isNaN(pageSize)) {
    throw new Error(
      'No "size" query param was provided in the request; please provide this value to retrieve the breeds.'
    );
  }
  if (!pageNumber || isNaN(pageNumber)) {
    throw new Error(
      'No "page" query param was provided in the request; please provide this value to retrieve the breeds.'
    );
  }
  const allBreeds = await dogBreedService.getBreeds({
    pageSize,
    pageNumber,
  });
  res.statusCode = 200;
  res.send(JSON.stringify(allBreeds));
});

app.get("/breeds/detail/:id", async (req, res) => {
  const numberOfImages = Number(req.query.numberOfImages); // the number of images that should be retrieved for the breed details page
  const breedId = req.params.id;
  const breedDetails = await dogBreedService.getBreedDetails({
    breedId,
    numberOfImages,
  });
  res.send(JSON.stringify(breedDetails));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
