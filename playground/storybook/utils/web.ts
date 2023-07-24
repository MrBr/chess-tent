import { ReactElement } from 'react';
import { Application } from '@chess-tent/web/src/application/types';

const withWebNamespace =
  <T, K extends keyof Application>(
    namespace: K,
    render: (
      args: T,
      Namespace: Application[K],
      loadersResult: any,
    ) => ReactElement,
  ) =>
  (args: T, { loaded }: any) =>
    render(args, loaded.application[namespace], loaded);

const importWebModule = async <T>(loadModule: () => Promise<T>): Promise<T> => {
  const { default: application } = await import(
    '@chess-tent/web/src/application'
  );
  await application.init();
  const module = await loadModule();
  return typeof module === 'object' ? { ...module } : module;
};

export { importWebModule, withWebNamespace };
