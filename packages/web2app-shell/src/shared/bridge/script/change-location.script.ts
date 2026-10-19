// CHANGE_LOCATION открывает другую страницу сайта без перезагрузки. Роутер
// сайта слушает popstate, как и для кнопки «назад». У state та форма, что
// хранит react-router, поэтому его индекс истории остаётся верным
export const CHANGE_LOCATION_SCRIPT = `
  commandHandlers.CHANGE_LOCATION = ({ url }) => {
    const target = new URL(url, location.href);
    if (target.origin !== location.origin || target.href === location.href) {
      return;
    }
    const index =
      history.state && typeof history.state.idx === 'number'
        ? history.state.idx
        : 0;
    const state = {
      usr: null,
      key: Math.random().toString(36).slice(2, 10),
      idx: index + 1,
    };
    history.pushState(state, '', target.pathname + target.search + target.hash);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  };
`;
