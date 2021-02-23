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

This project is structured as monorepo (https://classic.yarnpkg.com/blog/2017/08/02/introducing-workspaces/) which means this project can have dozens of packages inside it.

List of packages(you will mainly use `server`, `web` and `types` packages):

- chessground (the library used for chess UI https://github.com/ornicar/chessground)
- core-module (modules management )
- models (models interfaces for mongoDB entity schemas and for redux state)
- normalization (used for state normalization)
- **server** - backend(BE) part of the app
- **types** - types for functions, components, variables that are used in both packages (`server` and `web`)
- **web** - frontend(FE) part of the app
- playground (future ideas)

If you want to import `User` model from `models` package inside `server` package you are doing it like this

```ts
import { User } from '@chess-tent/models';
```

Each package has `@chess-tent/` prior to a package name. For example `@chess-tent/core-module`, `@chess-tent/models` etc.

### Used Technologies

- `web` package

  - **react** - JS library used for building user interface(UI) https://reactjs.org/
  - **redux** - every application needs to keep its data/state when running. https://redux.js.org/
  - **react-redux** - this lib gives us the possibility to use react alongside redux https://react-redux.js.org/
  - **emotion** - writing css styles with js https://emotion.sh/. `styled` method is most often used feature from this library. https://emotion.sh/docs/styled
  - **react-bootstrap** - bootstrap components for react. We are using their UI components https://react-bootstrap.github.io/ . You will see that there is often case when we wrap react-bootstrap component with `styled`. For example

  ```jsx
  import { Card } from 'react-bootstrap/Card'; // we import from other module

  const CardComponent = styled(Card)({
    border: 0,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'transparent',
  });
  ```

  - **formik** - for building forms with React (easier validations of input fields, error messages etc.) https://formik.org/
  - **yarn** - package manager. Used for libraries/dependencies installation(like Maven for Java, nuget for C# etc.)
  - **jest** - testing framework

- `server` package

  - **express.js** - framework to build APIs. You have to have node.js installed on machine
  - **mongodb** - NoSQL database(document-based) https://www.mongodb.com/
  - **mongoose** - ODM for mongodb. Something like ORM for relational databases.
  - **compass** - or any other db editor for mongoDB
  - **mailgun.js** - email service. To send emails to chess-tent users.

  `web` and `server`

  - **node.js** - js runtime environment (https://nodejs.org/en/download/)
  - **typescript** - add static typing to JS.
  - **socket.io and ws** - used for websocket communication between `server` and `web` - for example in chess-tent chat. (https://socket.io/docs/v3/index.html)

### Transpilers and JS

Transpilers are used to get some new programming language features even if they don't exist in web browser environment - for a long time we could use [arrow function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) even that feature was not part of the browser environment yet.

The most popular transpilers are babel and **typescript**. Typescript is also defined as compiler because typescript has to be compiled into JS at the end of the day.

In chess-tent project, you can see the use of `tsconfig.json` and `tsconfig.build.json` files. These files define in which way TS compiler has to "behave" in this project.

Example of compiler options (link to all available options https://www.typescriptlang.org/tsconfig)

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "noEmit": true,
    "jsx": "react",
    "module": "esnext",
    "isolatedModules": true,
    "baseUrl": "./src"
  },
  "include": ["./src"]
}
```

### How to start this project

1. install node.js on your own machine https://nodejs.org/en/
2. install yarn package manager on your own machine https://classic.yarnpkg.com/en/docs/install. As you see you can use npm package manager to install yarn(npm package manager is installed automatically as you install node.js). This is the similar situation as we used internet explorer to install chrome or firefox on windows :)
3. install mongodb
4. go to `chess-tent` directory and run in terminal `yarn install` or `yarn`
5. run `yarn build:dev` -> every package has to have /dist folder where transpiled code is (after you execute this command you will see that `dist` folder is created in every package)
6. Run mongodb database on your OS
7. you have to run `server` and `web` projects in parallel. First, to start FE - go to web package `cd packages/web` and then `yarn start`. A browser window will launch with the app running on `http://localhost:3000`
8. In another terminal window go to `chess-tent` directory also and run BE - go to server package `cd packages/web` and then `yarn start`

### Structure of server and web projects

Web and server have `application` and `modules` modules. In Application module we define types needed for application. In modules are application entities which are building blocks of application.
TBD

#### Visual studio code(vsc) environment setup

1. Install prettier package
2. You can setup to format on Save
   2.1. Go to File/Preferences/Settings
   2.2. Search for formatOnSave and check the box (prettier will format code on existed .prettierrc setup)
3. Install eslint package (make vscode to log errors in development from .eslintrc file)
4. ctrl + shift + p eslint: show output channel
5. If vscode returns message ELINT is not running... Press ctrl + , to go to settings. in Workspace pick extensions/eslint
   and pick "Edit in settings.json" and paste

```json
{
  "eslint.validate": [
    {
      "language": "javascriptreact",
      "autoFix": true
    },
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    },
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ]
}
```

**Some additional packages for vsc**

- Auto Close Tag - automatically add HTML/JSX close tag
- Auto Rename Tag - automatically rename HTML/JSX paired tag
- ES7 React/Redux/GraphQL/React-Native snippets - snippets for react
- Git lens - to see who committed code on every line
- git history - to see git history with graph and details
- jest - for testing feedback in file

## Local environments

For local development we have to define default environments. Those environments are defined in `.env` files. `server` and `web` have `,env` file where things like api domain, db url, aws keys and mailgun endpoint are defined.

## Unit tests

TBD

## Build for production

run `yarn build`. The output can be seen in the `build` folder.

### Monorepo and advantages of this project structure

TBD
