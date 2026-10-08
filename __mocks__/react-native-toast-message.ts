import { createElement } from 'react';

const Toast = Object.assign(
  (props: object) => createElement('Toast', { testID: 'toast', ...props }),
  { show: jest.fn(), hide: jest.fn() },
);

export default Toast;
