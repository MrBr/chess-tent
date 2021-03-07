### @chess-tent/server

Backend for chess-tent project

### Available Scripts

- `yarn clean` to delete `dist` folder
- `yarn start` to start server package. Application will be started on port: 3007
- `yarn start:nodemon` to start server package. This script will restart server on every change done by
  developer in code inside `server` package
- `yarn build` to run production build

### Used Technologies

- **express.js** - framework to build APIs. You have to have node.js installed on machine
- **mongodb** - NoSQL database(document-based) https://www.mongodb.com/
- **mongoose** - ODM for mongodb. Something like ORM for relational databases.
- **mailgun.js** - email service. To send emails to chess-tent users.
- **typescript** - add static typing to JS.
- **db editor** - install compass (https://docs.mongodb.com/compass/master/install/)
