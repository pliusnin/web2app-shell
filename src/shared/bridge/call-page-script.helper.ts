import type { PageCall } from './bridge.types';

/**
 * Builds a script for injectJavaScript that calls a bridge function on the
 * page: a command, a reply to a call, or a new state. A page without the
 * bridge ignores it.
 */
export const callPageScriptHelper = ({ fn, args }: PageCall) => {
  const name = `window.__MG_Native_${fn}`;
  const json = args.map(arg => JSON.stringify(arg)).join(', ');
  return `${name} && ${name}(${json}); true;`;
};
