### @chess-tent/web

Frontend for chess-tent project. This project is created using CRA https://github.com/facebook/create-react-app

### Available Scripts

pre-step `cd packages/web`

- `yarn start` to start web package. Application will be run on http://localhost:3000
- `yarn build` to run production build

### Used Technologies

 - **react** - JS library used for building user interface(UI) https://reactjs.org/
  - **react-redux** - used for state management https://react-redux.js.org/
  - **emotion** - writing css styles with js https://emotion.sh/. `styled` method is most often used feature from this library. https://emotion.sh/docs/styled
  - **react-bootstrap** - UI lib (react counterpart). Theirs UI components https://react-bootstrap.github.io/ are used in development. There is often a case when  react-bootstrap component are wrapped with `styled`. For example

  ```jsx
  import { Card } from 'react-bootstrap/Card'; // we import from other module

  const CardComponent = styled(Card)({
    border: 0,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'transparent',
  });
  ```

  - **formik** - for building forms with React (easier validations of input fields, error messages etc.) https://formik.org/
  - **jest** - testing framework
  - **socket.io and ws** - used for websocket communication between `server` and `web` - for example in chess-tent chat. (https://socket.io/docs/v3/index.html)