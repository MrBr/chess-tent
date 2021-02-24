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

- Auto Close Tag - automatically add HTML/JSX close tag (https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

- Auto Rename Tag - automatically rename HTML/JSX paired tag (https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
- ES7 React/Redux/GraphQL/React-Native snippets - snippets for react (https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- Git lens - to see who committed code on every line (https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- Git history - to see git history with graph and details (https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)
- Jest - for testing feedback in IDE (https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
