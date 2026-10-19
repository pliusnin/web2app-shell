// WEB_READY сообщает приложению, что сайт заполнил #root и браузер отрисовал
// с ним кадр. Страница без #root готова сразу после разбора
export const WEB_READY_SCRIPT = `
  const sendWebReady = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => post({ cmd: 'WEB_READY' }));
    });
  };

  const watchFirstScreen = () => {
    const root = document.getElementById('root');
    if (!root || root.childElementCount > 0) {
      sendWebReady();
      return;
    }
    new MutationObserver((_, observer) => {
      if (root.childElementCount > 0) {
        observer.disconnect();
        sendWebReady();
      }
    }).observe(root, { childList: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchFirstScreen);
  } else {
    watchFirstScreen();
  }
`;
