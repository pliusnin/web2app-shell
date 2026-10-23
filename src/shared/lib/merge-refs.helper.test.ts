import { createRef } from 'react';

import { mergeRefsHelper } from './merge-refs.helper';

const VALUE = { id: 'web-view' };

describe('mergeRefsHelper', () => {
  it('calls callback refs with the value', () => {
    const first = jest.fn();
    const second = jest.fn();

    mergeRefsHelper(first, second)(VALUE);

    expect(first).toHaveBeenCalledWith(VALUE);
    expect(second).toHaveBeenCalledWith(VALUE);
  });

  it('sets the value to object refs', () => {
    const ref = createRef<typeof VALUE>();

    mergeRefsHelper(ref)(VALUE);

    expect(ref.current).toBe(VALUE);
  });

  it('fills callback and object refs together', () => {
    const callback = jest.fn();
    const ref = createRef<typeof VALUE>();

    mergeRefsHelper(callback, ref)(VALUE);

    expect(callback).toHaveBeenCalledWith(VALUE);
    expect(ref.current).toBe(VALUE);
  });

  it('skips missing refs', () => {
    const ref = createRef<typeof VALUE>();

    expect(() => mergeRefsHelper(undefined, null, ref)(VALUE)).not.toThrow();
    expect(ref.current).toBe(VALUE);
  });

  it('passes null to every ref when the element is detached', () => {
    const callback = jest.fn();
    const ref = createRef<typeof VALUE>();
    const merged = mergeRefsHelper(callback, ref);

    merged(VALUE);
    merged(null);

    expect(callback).toHaveBeenLastCalledWith(null);
    expect(ref.current).toBeNull();
  });
});
