# DogApp BFF

This backend service was generated with [Node.js](https://nodejs.org/en) and is served by [Express](https://expressjs.com/).

## Before running

This application works in conjunction with the [Dog App Node BFF](https://github.com/jdbadilla/dog-app-bff). Please make sure you are running that before initializing the development server.

## Development server

Run `npx tsx index.ts` to run the backend service locally. It is served on port 3000 (`http://localhost:3000/`). If you change something, the application must be manually reloaded in order for the changes to be reflected.

This BFF (Backend-For-Frontend) service provides two endpoints:

1. `GET /breeds/list/all?size=10`: An endpoint to retrieve all dog breeds from the [Dog API](https://dog.ceo/dog-api/documentation/sub-breed), which also flattens the list and caches it in memory
2. `GET /breeds/detail/:id`: An endpoint that retrieves details about a specific breed (such as an image URL and related sub-breeds) from the cache based on the provided id.

Important: Given that the Dog API returns no unique identifiers, we are generating an ID for each breed by concatenating the breed and sub breed.

## Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io/).

## Further help

If you have any questions, do not hesitate to reach out to José Badilla at jdbadilla@gmail.com.
