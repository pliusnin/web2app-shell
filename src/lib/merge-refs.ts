import type { Ref, RefCallback } from 'react';

// One element, several owners: the parent's ref and the component's own ref
export const mergeRefs =
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
