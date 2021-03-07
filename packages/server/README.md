### @chess-tent/server

Backend for chess-tent project

install compass (https://docs.mongodb.com/compass/master/install/) or any other db editor for mongoDB

### Available Scripts

pre-step `cd packages/server`

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