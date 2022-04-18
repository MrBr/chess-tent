// Straightening the react-router v5 types in web package.
// Storybook has a different version of react-router installed in root node_modules.
// That version overrides the web router types and tricks typescript.
// NOTE
//  Once react router is upgraded to v6 this file can be removed alongside
//  with @types/react-router dev dependency.
declare module 'react-router' {
  export * from '@types/react-router';
}
