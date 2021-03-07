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

### Modules inside project

This project is structured as lerna monorepo (https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/, https://github.com/lerna/lerna) which means this project can have dozens of packages inside it.

List of packages(you will mainly use `server`, `web` and `types` packages):

- chessground (it is the fork of https://github.com/ornicar/chessground - library used for chess UI)
- core-module (modules management)
- models (models interfaces for mongoDB entity schemas and for redux state)
- normalization (used for state normalization)
- **server** - backend(BE) part of the app
- **types** - types for functions, components, variables that are used in both packages (`server` and `web`)
- **web** - frontend(FE) part of the app
- playground (future ideas)

```ts
import { User } from '@chess-tent/models';
```

Each package has `@chess-tent/` prior to a package name. For example `@chess-tent/core-module`, `@chess-tent/models` etc.

### Used Technologies

  - **yarn** - package manager. Used for libraries/dependencies installation(like Maven for Java, nuget for C# etc.)  
  - **node.js** - js runtime environment (https://nodejs.org/en/download/)
  - **typescript** - add static typing to JS.

### How to start this project

1. install node.js https://nodejs.org/en/
2. install yarn package manager https://classic.yarnpkg.com/en/docs/install.
3. install mongodb
4. go to `chess-tent` directory and run in terminal `yarn install` or `yarn`
5. run `yarn build:dev`
6. run mongodb database on your OS
7. run `server` and `web` projects in parallel. First, to start FE - go to web package `cd packages/web` and then `yarn start`. A browser window will launch with the app running on `http://localhost:3000`
8. In another terminal window go to `chess-tent` directory also and run BE - go to server package `cd packages/web` and then `yarn start`

### Applications architecture

- **application** - used for global application types (types used by the application and the modules)
- **modules** - application type implementations (building blocks)


## .env file

Use `.env` file for local configuration. `server` and `web` have `.env` file where default variables like api domain, db url, aws keys and mailgun endpoint are defined.

## Unit tests

TBD

## Build for production

run `yarn build`. The output can be seen in the `build` folder.

### Monorepo and advantages of this project structure

TBD
