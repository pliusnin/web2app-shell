/**
 * Builds the page script that reports whether the localStorage key has a
 * value: once on start and on every change by setItem, removeItem, clear or
 * another window of the origin. Runs once per page, a second run only reports.
 */
export const createLocalStorageWatchScriptHelper = (key: string) =>
  // A string, not a function's source: Hermes keeps no source to send. Plain
  // browser JS, unchecked by tsc and ESLint
  [
    '(function () {',
    '  var key = ' + JSON.stringify(key) + ';',
    '  var watch = window.__MG_LocalStorageWatch;',
    '  if (!watch) {',
    '    var lastHasValue;',
    '    watch = window.__MG_LocalStorageWatch = function () {',
    '      var hasValue = false;',
    '      try {',
    '        hasValue = !!window.localStorage.getItem(key);',
    '      } catch (error) {}',
    '      if (hasValue !== lastHasValue && window.ReactNativeWebView) {',
    '        lastHasValue = hasValue;',
    '        window.ReactNativeWebView.postMessage(JSON.stringify({',
    "          cmd: 'LOCAL_STORAGE_KEY',",
    '          args: { hasValue: hasValue },',
    '        }));',
    '      }',
    '    };',
    '    var proto = window.Storage && window.Storage.prototype;',
    "    ['setItem', 'removeItem', 'clear'].forEach(function (name) {",
    '      var original = proto && proto[name];',
    '      if (!original) {',
    '        return;',
    '      }',
    '      proto[name] = function () {',
    '        try {',
    '          return original.apply(this, arguments);',
    '        } finally {',
    '          watch();',
    '        }',
    '      };',
    '    });',
    "    window.addEventListener('storage', function () {",
    '      watch();',
    '    });',
    '  }',
    '  watch();',
    '})();',
    // iOS fails an injected script whose last value can't be serialized
    'true;',
  ].join('\n');
