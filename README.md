## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run with Docker

You can run the application and DynamoDB locally using Docker Compose:

```bash
$ docker-compose build
$ docker-compose up -d
```

This will start both the API and a local DynamoDB instance. The API will be available at `http://localhost:3000`.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
