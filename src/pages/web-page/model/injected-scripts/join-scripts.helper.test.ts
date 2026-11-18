import { joinScriptsHelper } from './join-scripts.helper';

describe('joinScriptsHelper', () => {
  it('gives no script when none is set', () => {
    expect(joinScriptsHelper(undefined, undefined)).toBeUndefined();
    expect(joinScriptsHelper('', undefined)).toBeUndefined();
  });

  it('keeps a single script as is', () => {
    expect(joinScriptsHelper(undefined, 'true;')).toBe('true;');
  });

  it('runs every script even when one ends without a semicolon', () => {
    const calls: Array<string> = [];
    const script = joinScriptsHelper(
      'calls.push("custom") // no semicolon',
      '(function () { calls.push("watch"); })();',
    );

    // eslint-disable-next-line no-new-func
    new Function('calls', script ?? '')(calls);

    expect(calls).toEqual(['custom', 'watch']);
  });
});
