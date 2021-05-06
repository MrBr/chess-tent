export const getDiff = (
  oldSubject: {} | unknown[],
  newSubject: {} | unknown[],
  result: { [key: string]: unknown } = {},
  path = '',
): { [key: string]: unknown } => {
  for (const key in newSubject) {
    const newValue = newSubject?.[key as keyof typeof newSubject];
    const oldValue = oldSubject?.[key as keyof typeof newSubject];

    const newPath = path + key;
    if (
      typeof newValue === 'object' &&
      typeof newValue === typeof oldValue &&
      Array.isArray(newValue) === Array.isArray(oldValue) &&
      newValue !== oldValue
    ) {
      getDiff(oldValue, newValue, result, newPath + '.');
    } else if (newValue !== oldValue) {
      result[newPath] = newValue;
    }
  }
  return result;
};
