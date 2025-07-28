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

API estará disponível em: [http://localhost:3000](http://localhost:3000).

## Acessar o container Docker para rodar comandos

Para acessar o container da aplicação no Docker, use:

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

## Acessando a documentação

A documentação em Swagger do projeto estará disponível no endpoint apenas no ambiente de desenvolvimento: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Variáveis de ambientes

Crie um arquivo `.env` e copie as variáveis do arquivo `.env.example`.

  1. Gere uma chave para a `JWT_SECRET`:

     ```bash
     $ openssl rand -hex 64
     ```

  2. Gere uma chave para a `JWT_USER_PASS` e uma para a `JWT_SYSTEM_PASS`:

     ```bash
     $ node -e "const bcrypt = require('bcrypt'); bcrypt.hash('<sua senha aqui>', 10).then(hash => console.log(hash))"
     ```

  3. Crie uma conta e gere uma API Key do Datadog para habilitar monitoramento.