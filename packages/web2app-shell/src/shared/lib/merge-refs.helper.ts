import type { Ref, RefCallback } from 'react';

/**
 * Combines several refs into one ref callback so an element can have
 * several owners: the parent's ref and the component's own ref.
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
