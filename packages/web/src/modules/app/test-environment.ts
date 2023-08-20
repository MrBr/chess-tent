import application from '@application';

const isTestEnvironment = () => process.env.NODE_ENV === 'test';

const registerInTestEnvironment = <T>(
  loadModule: () => T extends Promise<infer K> ? T : never,
) => isTestEnvironment() && application.register(loadModule);

export default registerInTestEnvironment;
