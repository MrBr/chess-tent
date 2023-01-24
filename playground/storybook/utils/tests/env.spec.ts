import {
  mergeToProcessEnv,
  parseEnv,
  splitKeyValue,
  trimComment,
  trimWrappingQuotes,
} from '../env';

describe('splitKeyValue', () => {
  it('should match empty string', () => {
    expect(splitKeyValue('')).toEqual(['', '']);
  });

  it('should match white spaces', () => {
    expect(splitKeyValue('')).toEqual(['', '']);
  });

  it('should match string', () => {
    expect(splitKeyValue('abc')).toEqual(['abc', '']);
  });

  it('should match =', () => {
    expect(splitKeyValue('=')).toEqual(['', '']);
  });

  it('should match =bbb', () => {
    expect(splitKeyValue('=bbb')).toEqual(['', 'bbb']);
  });

  it('should match multiple = symbols', () => {
    expect(splitKeyValue('a=b=c')).toEqual(['a', 'b=c']);
  });

  it('should match multiple separated equals symbols', () => {
    expect(splitKeyValue('a="b = c"')).toEqual(['a', '"b = c"']);
  });

  it('should match key spaced value', () => {
    expect(splitKeyValue('a = b')).toEqual(['a', 'b']);
  });

  it('should match key value', () => {
    expect(splitKeyValue('a=b')).toEqual(['a', 'b']);
  });
});

describe('trimComment', () => {
  it('should trim empty string', () => {
    const line = trimComment('');
    expect(line).toBe('');
  });

  it('should not trim a comment in double quotes', () => {
    const line = trimComment('"abc#comment"');
    expect(line).toBe('"abc#comment"');
  });

  it('should not trim a comment in single quotes', () => {
    const line = trimComment("'abc#comment'");
    expect(line).toBe("'abc#comment'");
  });

  it('should trim comment after a string', () => {
    const line = trimComment('abc#comment');
    expect(line).toBe('abc');
  });

  it('should trim comment after the white space', () => {
    const line = trimComment('   #comment');
    expect(line).toBe('');
  });

  it('should trim comment', () => {
    const line = trimComment('#comment');
    expect(line).toBe('');
  });
});

describe('trimWrappingQuotes', () => {
  it('should leave empty string', () => {
    const line = trimWrappingQuotes('');
    expect(line).toBe('');
  });

  it('should leave a string', () => {
    const line = trimWrappingQuotes('abc');
    expect(line).toBe('abc');
  });

  it('should not trim double quotes in string', () => {
    const line = trimWrappingQuotes('aa"d"a');
    expect(line).toBe('aa"d"a');
  });

  it('should not trim single quotes in string', () => {
    const line = trimWrappingQuotes("aa'd'a");
    expect(line).toBe("aa'd'a");
  });

  it('should trim double quotes', () => {
    const line = trimWrappingQuotes('"abc"');
    expect(line).toBe('abc');
  });

  it('should trim single quotes', () => {
    const line = trimWrappingQuotes("'abc'");
    expect(line).toBe('abc');
  });
});

describe('parseEnv', () => {
  it('should throw if value is invalid', () => {
    expect(() =>
      parseEnv(`
      key=
    `),
    ).toThrow();
  });

  it('should throw if key is invalid', () => {
    expect(() =>
      parseEnv(`
      =value
    `),
    ).toThrow();
  });

  it('should throw if key and value are invalid', () => {
    expect(() =>
      parseEnv(`
      =
    `),
    ).toThrow();
  });

  it('should parse an empty string', () => {
    const envObject = parseEnv('');
    expect(envObject).toEqual({});
  });

  it('should parse white space', () => {
    const envObject = parseEnv(`
    
    
    `);
    expect(envObject).toEqual({});
  });

  it('should parse commented env', () => {
    const envObject = parseEnv(`
    #value=test
    `);
    expect(envObject).toEqual({});
  });

  it('should parse env with a comment', () => {
    const envObject = parseEnv(`
    value=test
    #comment
    `);
    expect(envObject).toEqual({ value: 'test' });
  });

  it('should parse env with comment after value', () => {
    const envObject = parseEnv(`
    value=test#comment
    `);
    expect(envObject).toEqual({ value: 'test' });
  });

  it('should parse single value with double quotes', () => {
    const envObject = parseEnv('test="aaaa"');
    expect(envObject).toEqual({ test: 'aaaa' });
  });

  it('should parse single value with single quotes', () => {
    const envObject = parseEnv("test='aaaa'");
    expect(envObject).toEqual({ test: 'aaaa' });
  });

  it('should parse single value without quotes', () => {
    const envObject = parseEnv('test=aaaa');
    expect(envObject).toEqual({ test: 'aaaa' });
  });

  it('should parse single integer value', () => {
    const envObject = parseEnv('test=123');
    expect(envObject).toEqual({ test: '123' });
  });

  it('should parse value with white space', () => {
    const envObject = parseEnv('value="    "');
    expect(envObject).toEqual({ value: '    ' });
  });

  it('should parse multiple values', () => {
    const envObject = parseEnv(`
    num=123
    str=abc
    `);
    expect(envObject).toEqual({ num: '123', str: 'abc' });
  });

  it('should parse multiple values separated by space', () => {
    const envObject = parseEnv(`
    num=123
    str=abc
    spaced = abc
    
    
    bottomStr=last
    `);
    expect(envObject).toEqual({
      num: '123',
      str: 'abc',
      bottomStr: 'last',
      spaced: 'abc',
    });
  });
});

describe('mergeToProcessEnv', () => {
  it('should add variables to env', function () {
    mergeToProcessEnv({ test: 123 });
    expect(process.env.test).toBe('123');
  });
});
