export const nonNullOrUndefined = <T>(obj: T) => {
  const propNames = Object.getOwnPropertyNames(obj);
  const result = {} as T;
  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i];
    // @ts-ignore
    if (obj[propName] !== null && obj[propName] !== undefined) {
      // @ts-ignore
      result[propName] = obj[propName];
    }
  }

  return result;
};
