// @ts-nocheck
const registers = [];
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
  getDependantPath: Function;
  constructor(message) {
    super(message);
    this.name = "DependencyError";
  }
}
export const createNamespace = (initialNamespace = {}) =>
  new Proxy(initialNamespace, {
    get(target, prop, receiver) {
      if (prop === "__esModule") {
        // Lol
        return target;
      } else if (prop === "then") {
        // Lol x 2
        return;
      } else if (target[prop]) {
        return target[prop];
      }
      throw new DependencyError(`Prop ${String(prop)} not defined yet!`);
    }
  });

const resolveModule = (loadModule: () => Promise<any>, cb?: Function) => {
  return new Promise((resolve, reject) => {
    loadModule()
      .then(module => {
        cb && cb(module);
        resolve(module);
      })
      .catch(e => {
        if (e.name === "DependencyError") {
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
            !loaded && delete require.cache[id];
          });
        } else {
          console.error(e);
        }
        reject(e);
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
      registerParams
    };
  } else if (
    moduleCursor.registerParams === registerParams &&
    moduleCursor.deferredCount === deferredModules.length
  ) {
    throw Error(
      `Can't resolve module: ${registerParams[0]} (usually sing of a missing or a circular dependency).` +
        `\nFailed with error: ${moduleCursor.error}`
    );
  }

  return resolveModule(...(registerParams as Parameters<typeof register>))
    .then(() => {
      moduleCursor = null;
    })
    .catch(e => {
      moduleCursor.error = e;
      deferredModules.push(registerParams);
    })
    .finally(resolveDeferredModules);
};

export const register = <T>(
  loadModule: () => T extends Promise<infer K> ? T : never,
  cb?: (module: T extends Promise<infer K> ? K : never) => void
) => {
  const promise = new Promise(resolve => {
    resolveModule(loadModule, cb)
      .then(resolve)
      .catch(e => {
        deferredModules.push([loadModule, cb]);
        resolve();
      });
  });
  registers.push(promise);
};

export const init = () => {
  return new Promise((resolve, reject) => {
    Promise.all(registers)
      .finally(() => {
        resolveDeferredModules()
          .then(resolve)
          .catch(e => {
            // Module couldn't be resolved, showing error stack.
            console.error(e);
            reject(e);
          });
      })
      .catch(() => {
        // Noop catch to prevent application crash.
        // Probably some registers will fail in the first register cycle,
        // but as those are deferred there is no need to handle the error here.
      });
  });
};
