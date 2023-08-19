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
let initialised = false;
let initializationPromise;

const DEPENDENCY_ERROR_NAME = 'DependencyError';
class DependencyError extends Error {
  constructor(message) {
    super(message);
    this.name = DEPENDENCY_ERROR_NAME;
  }
}

const markInitialised = () => {
  initialised = true;
};

export const createNamespace = (initialNamespace = {}) =>
  new Proxy(initialNamespace, {
    get(target, prop) {
      if (
        initialised ||
        typeof prop === 'symbol' ||
        Reflect.has(target, prop)
      ) {
        // Once the core has been initialised things are getting more complex.
        // Various properties may be accessed and there is no easy way to tell
        // if the property is a part of the namespace.
        return Reflect.get(target, prop);
      }
      throw new DependencyError(
        `Namespace export ${String(prop)} not defined.`,
      );
    },
  });

const resolveModule = async (loadModule: () => Promise<any>, cb?: Function) => {
  try {
    const module = await loadModule();
    cb && cb(module);
    return module;
  } catch (e) {
    if (e.name === DEPENDENCY_ERROR_NAME) {
      Object.values(require.cache).forEach(cachedRequire => {
        // For some reason, require.cache doesn't have the same shape in every browser?!
        // Sometimes `id` is replaced with `i` and `loaded` with `l`
        const loaded =
          cachedRequire.loaded !== undefined
            ? cachedRequire.loaded
            : cachedRequire.l;
        const id =
          cachedRequire.id !== undefined ? cachedRequire.id : cachedRequire.i;
        if (!loaded) {
          delete require.cache[id];
        }
      });
    }
    throw e;
  }
};

const resolveDeferredModules = async () => {
  if (deferredModules.length === 0) {
    return;
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
    throw moduleCursor.error;
  }

  try {
    await resolveModule(...(registerParams as Parameters<typeof register>));
    moduleCursor = null;
  } catch (e) {
    if (e.name !== DEPENDENCY_ERROR_NAME) {
      throw e;
    }
    moduleCursor.error = e;
    deferredModules.push(registerParams);
  }

  return resolveDeferredModules();
};

export const register = <T>(
  loadModule: () => T extends Promise<infer K> ? T : never,
  cb?: (module: T extends Promise<infer K> ? K : never) => void,
) => {
  deferredModules.push([loadModule, cb]);
};

export const init = () => {
  if (!initializationPromise) {
    initializationPromise = new Promise((resolve, reject) => {
      resolveDeferredModules()
        .then(markInitialised)
        .then(resolve)
        .catch(e => {
          // Module couldn't be resolved, showing error stack.
          console.error(e);
          reject(e);
        });
    });
  }
  return initializationPromise;
};
