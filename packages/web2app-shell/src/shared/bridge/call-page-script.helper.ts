import type { PageCall } from './bridge.types';

/**
 * Собирает скрипт для injectJavaScript, который вызывает функцию моста на
 * странице: команду, ответ на вызов или новое состояние. Страница без моста
 * его игнорирует.
 */
export const callPageScriptHelper = ({ fn, args }: PageCall) => {
  const name = `window.__MG_Native_${fn}`;
  const json = args.map(arg => JSON.stringify(arg)).join(', ');
  return `${name} && ${name}(${json}); true;`;
};
