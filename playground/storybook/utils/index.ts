import { ReactElement } from 'react';
import { Application } from '@chess-tent/web/src/application/types';
import application from '@chess-tent/web/src/application';

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

const importWebModule = async <T extends Promise<any>>(
  loadModule: () => T,
): Promise<T extends Promise<infer K> ? K : never> => {
  await application.init();
  const module = await loadModule();
  return typeof module === 'object' ? { ...module } : module;
};

export { importWebModule, withWebNamespace };
