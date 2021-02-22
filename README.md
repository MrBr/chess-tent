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

### Used Technologies

1. Koje tehnologije se koriste u projektu i jako kratko o njima (redux, react, jest etc.)

### Modules inside project

2. kako je poslozen projekt i sta predstavlja koji package
   packages (ukratko o svakom packageu) - chessground - core-module - models - normalization (normaliziran state, ne ulaziti u dubinu) - server - types - web
   playground (mislim da o ovome ne trebam nista govorit za sad)

### How to start project

3. kako pokrenut projekt (yarn install, yarn build:dev). startanje servera, startanje weba, treba instalirat monogdb (dodatni neki koraci ako je potrebno)

### Transpilers and JS

4. zasto trebamo yarn build dev (typescript, transpileri ukratko i njihova uloga), zasto koristimo typescript, tsconfig file kako je poslozen ukratko. (mozda spomenut babel i to je to). Osvrnuti se na types package

### Structure of server and web projects

5. na koji nacin su poslozeni server i web projekti (application, modules i njihove uloge)

### Additional

#### Visual studio code(vscode) environment setup

1. Install prettier package
2. You can setup to format on Save
   1. Go to File/Preferences/Settings
   2. Search for formatOnSave and check the box (prettier will format code on existed .prettierrc setup)
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

#### Advantages of this project structure

7. zasto je projekt strukturiran na ovaj nacin (packages in monorepo i razlika od "standardnih" projekata=> yarn link za monorepo)(briefly about lerna)(youtube link za lernu, yarn ako hoce neka si pogleda )
