## Descrição

Projeto de mensagens com DynamoDB, Docker e autenticação JWT.

Fork do [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Setup

```bash
$ npm install
```

## Compile e rode o projeto em dev

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Caminho alternativo: Rode com Docker

```bash
$ docker-compose build
$ docker-compose up -d
```

Os comandos vão buildar e iniciar o DynamoDB local e a API.

API estará disponível em: `http://localhost:3000`.

## Acessar o container Docker para rodar comandos

Para acessar o container e rodar comandos como `npx`, use:

```bash
$ docker exec -it message-api sh
```

Isso abrirá um shell dentro do container. Agora você pode rodar comandos como:

```bash
$ npm <comando>
```

## Criando o banco local e adicionando dados de exemplo

Dentro da shell do container ou na sua bash (como preferir), rode os comandos:

```bash
$ npx ts-node src/database/create.database.ts
$ npx ts-node src/database/seed.database.ts
```

## Rodando testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
