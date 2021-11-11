# Chess Tent

### Setup instructions

Run these commands:

```shell script
yarn build:dev
docker-compose -f docker-compose.yml
```

Then open up 2 terminal windows and run following in each

```shell script
cd ./packages/server
yarn start
```

```shell script
cd ./packages/web
yarn start
```

Access the app at http://localhost:3000

### Modules

- Lerna monorepo (https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/, https://github.com/lerna/lerna)

List of packages:

- chessground (it is the fork of https://github.com/ornicar/chessground - library used for chess UI)
- core-module (modules management)
- models (models interfaces for mongoDB entity schemas and for redux state)
- normalization (used for state normalization)
- **server** - backend(BE) part of the app
- **types** - types for API, actions, state
- **web** - frontend(FE) part of the app
- playground (future ideas)

### Prerequisites

- **yarn** - package manager (https://yarnpkg.com/)
- **node.js** - js runtime environment (https://nodejs.org/en/download/)
- **mongodb** - database (https://www.mongodb.com/)

### Setup

1. install node.js https://nodejs.org/en/
2. install yarn package manager https://classic.yarnpkg.com/en/docs/install.
3. install mongodb
4. run mongodb
5. run `yarn install` or `yarn` in project root
6. run `yarn build:dev` in project root
7. run `start` script for wanted package

### Applications architecture

- **application** - used for global application types (types used by the application and the modules)
- **modules** - application type implementations (building blocks)

## .env file

Use `.env` file for local configuration. `server` and `web` have `.env` file where default variables like api domain, db url, aws keys and mailgun endpoint are defined.

## Unit tests

TBD

## Build for production

run `yarn build`. The output can be seen in the `build` folder.

## Stockfish (v.12) evaluation
In order for Stockfish 12 to work certain headers have to be defined on the top document (index.html).
```
'Cross-Origin-Opener-Policy': 'same-origin',
'Cross-Origin-Embedder-Policy': 'require-corp',
```
Craco is used to configure devServer and nginx for the production. More on this can be found at https://github.com/nmrugg/stockfish.js/issues/53

### Monorepo and advantages of this project structure

TBD
