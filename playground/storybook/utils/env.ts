export const WrappingQuotesRegex = /^("|')|("|')$/g;
export const CommentRegex = /^#.*|#.*[^"|']$/g;
export const KeyValueRegex = /=(.*)/;

export const splitKeyValue = (line: string) => {
  const [key = '', value = ''] = line.trim().split(KeyValueRegex);
  return [key.trim(), value.trim()];
};

export const trimWrappingQuotes = (value: string) => {
  return value.trim().replace(WrappingQuotesRegex, '');
};

export const trimComment = (line: string) => {
  return line.trim().replace(CommentRegex, '');
};

export const parseKeyValuePair = (line: string) => {
  const [key, rawValue] = splitKeyValue(line);

  const keyWithNoValue = key && (!rawValue || rawValue?.length === 0);
  const valueWithNoKey = !key && rawValue;
  const noKeyNoValue = !key && !rawValue;

  if (keyWithNoValue || valueWithNoKey || noKeyNoValue) {
    throw new Error(`Invalid key value pair ${key}=${rawValue}`);
  }

  const value = trimWrappingQuotes(rawValue);
  return [key, value];
};

export const parseEnv = (env: string) => {
  return env.split('\n').reduce<Record<string, string>>((res, line) => {
    const lineWithoutComment = trimComment(line);

    if (lineWithoutComment) {
      const [key, value] = parseKeyValuePair(lineWithoutComment);
      res[key] = value;
    }

    return res;
  }, {});
};

export const mergeToProcessEnv = (config: {}) => {
  Object.assign(process.env, config);
};
