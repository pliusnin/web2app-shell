/**
 * Joins the scripts injected into a page into one, skipping the ones that are
 * not set. Returns undefined when there is nothing to inject, so the WebView
 * gets no script at all.
 */
export const joinScriptsHelper = (
  ...scripts: Array<string | undefined>
): string | undefined => {
  const present = scripts.filter(Boolean);
  // A script may end without ";" or with a line comment: the separator keeps
  // the next one from being parsed as its continuation
  return present.length > 0 ? present.join('\n;\n') : undefined;
};
