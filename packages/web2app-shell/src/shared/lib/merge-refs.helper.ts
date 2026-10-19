import type { Ref, RefCallback } from 'react';

/**
 * Объединяет несколько ref в один ref-колбэк, чтобы у элемента могло быть
 * несколько владельцев: ref родителя и собственный ref компонента.
 */
export const mergeRefsHelper =
  <T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> =>
  value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
