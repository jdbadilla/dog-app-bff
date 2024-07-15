# DogApp BFF

This backend service was generated with [Node.js](https://nodejs.org/en) and is served by [Express](https://expressjs.com/).

## Development server

Run `npx tsx index.ts` to run the backend service locally. It is served on port 3000 (`http://localhost:3000/`). The application must be manually reloaded if you change something in order to see the changes.

This BFF (Backend-For-Frontend) service provides two endpoints:

1. `GET /breeds/list/all?size=10`: An endpoint to retrieve all dog breeds from the [Dog API](https://dog.ceo/dog-api/documentation/sub-breed), which also flattens the list and caches it in memory
2. `GET /breeds/detail/:id`: An endpoint that retrieves minimalist details about the breed (such as an image URL) from the cache based on the provided id.

Important: Given that the Dog API returns no unique identifiers, we are generating an ID for each of the breeds stored in the cache.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

For further help, do not hesitate to reach out to José Badilla, creator of the project, at jdbadilla@gmail.com.
