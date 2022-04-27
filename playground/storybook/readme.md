# Setting Storybook
To upgrade Storybook (or install) to a newer React temporary add `react` and `typescript` to `package.json` dependencies so that Storybook can figure out the environment.  

# Writing stories
There are two ways to write a story.

## Node module stories
These are the normal stories where dependencies are resolved statically in the runtime. <br/>
How to write stories:
- Prerequisites - new module
  - add module to the storybook package dependencies
  - exec yarn
  - create a new dir in stories folder
- In module dir inside stories add a new file matching the component
  - Import the code from the module and write story as specified for Storybook 6 

## Core module stories
These are not normal stories because dependencies aren't static. Core module package resolves dependencies asynchronously hence modules initialisation should be awaited before component is rendered.

How to write stories:
- Prerequisites - new module
    - Same as for node module
- Optional - for TS modules with aliases
  - Aliases are relative to each package. Storybook webpack is transpiling local modules and search for aliases
  - To be sure there is no alias overlapping in `main.js` define new module aliases and paths to alias file
- In module dir inside stories add a new file matching the component
    - Use utilities such as `importWebNamespace` to inject namespace to render once ready
    - Once namespace is injected use components from the injected namespace and render stories as for Storybook 6

### Private core module component story
Because of the asynchronous core module behavior the "private" module export (not attached to the application) must be used with React suspense (lazy). The application still has to be loaded fully because the private module (file) may have dependencies. 

To assure that the application is initialised use `withWebNamespace` and Suspense. See example in "ChaptersImport" story. 
