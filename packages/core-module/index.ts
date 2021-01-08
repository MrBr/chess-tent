// @ts-nocheck
const deferredModules = [];

// Used to track deferred modules and detect situations when no new dependencies are getting resolved.
// When all dependencies are not resolved application will crash.
// It can also be a sign of a circular dependency.
let moduleCursor: {
  deferredCount: number;
  registerParams: [];
  error?: Error;
} | null = null;

class DependencyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DependencyError';
  }
}
export const createNamespace = (initialNamespace = {}) =>
  new Proxy(initialNamespace, {
    get(target, prop, receiver) {
      if (prop === '__esModule' || prop === 'then') {
        // Lol
        return target;
      } else if (target[prop]) {
        return target[prop];
      }
      throw new DependencyError(
        `Namespace export ${String(prop)} not defined.`,
      );
    },
  });

const resolveModule = (loadModule: () => Promise<any>, cb?: Function) => {
  return new Promise((resolve, reject) => {
    loadModule()
      .then(module => {
        cb && cb(module);
        resolve(module);
      })
      .catch(e => {
        if (e.name === 'DependencyError') {
          Object.values(require.cache).forEach(cachedRequire => {
            // For some reason, require.cache doesn't have the same shape in every browser?!
            // Sometimes `id` is replaced with `i` and `loaded` with `l`
            const loaded =
              cachedRequire.loaded !== undefined
                ? cachedRequire.loaded
                : cachedRequire.l;
            const id =
              cachedRequire.id !== undefined
                ? cachedRequire.id
                : cachedRequire.i;
            if (!loaded) {
              delete require.cache[id];
            }
          });
          reject(e);
        } else {
          throw e;
        }
      });
  });
};

const resolveDeferredModules = () => {
  if (deferredModules.length === 0) {
    return Promise.resolve();
  }

  const registerParams = deferredModules.shift();

  if (!moduleCursor) {
    moduleCursor = {
      deferredCount: deferredModules.length,
      registerParams,
    };
  } else if (
    moduleCursor.registerParams === registerParams &&
    moduleCursor.deferredCount === deferredModules.length
  ) {
    throw Error(
      `Can't resolve module: ${registerParams[0]} (usually sing of a missing or a circular dependency).` +
        `\nFailed with error: ${moduleCursor.error}`,
    );
  }

  return resolveModule(...(registerParams as Parameters<typeof register>))
    .then(() => {
      moduleCursor = null;
    })
    .catch(e => {
      moduleCursor.error = e.message;
      deferredModules.push(registerParams);
    })
    .finally(resolveDeferredModules);
};

export const register = <T>(
  loadModule: () => T extends Promise<infer K> ? T : never,
  cb?: (module: T extends Promise<infer K> ? K : never) => void,
) => {
  deferredModules.push([loadModule, cb]);
};

export const init = () => {
  return new Promise((resolve, reject) => {
    resolveDeferredModules()
      .then(resolve)
      .catch(e => {
        // Module couldn't be resolved, showing error stack.
        console.error(e);
        reject(e);
      });
  });
};
