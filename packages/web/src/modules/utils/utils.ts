export const getDiff = (
  oldSubject: {} | unknown[],
  newSubject: {} | unknown[],
  result: { [key: string]: unknown } = {},
  path = '',
): { [key: string]: unknown } => {
  const keys = new Set([
    ...Object.keys(oldSubject),
    ...Object.keys(newSubject),
  ]);
  keys.forEach(key => {
    const newValue = newSubject?.[key as keyof typeof newSubject] as any;
    const oldValue = oldSubject?.[key as keyof typeof newSubject] as any;

    const newPath = path + key;
    if (
      // typeof null === object !?!
      !!newValue &&
      !!oldValue &&
      typeof newValue === 'object' &&
      typeof newValue === typeof oldValue &&
      Array.isArray(newValue) === Array.isArray(oldValue) &&
      newValue !== oldValue
    ) {
      if (Array.isArray(newValue) && oldValue.length > newValue.length) {
        // Issue: https://github.com/MrBr/chess-tent/issues/72#issuecomment-834757429
        // In the future, if diff updates ought to work with pop,
        // this is the place to write down how many elements should be popped.
        // Once array elements order change there is no real sense in partial update as the
        // objects are going to be mostly different. Then !== object should be set as a new values
        // without further comparison.
        result[newPath] = newValue;
      } else {
        getDiff(oldValue, newValue, result, newPath + '.');
      }
    } else if (newValue !== oldValue) {
      result[newPath] = newValue;
    }
  });
  return result;
};

export const noop = () => {};
export const noopNoop = () => noop;
