# offline-toast

Shows the "No internet connection" toast when the connection drops while the app is open.

## Entry points

- `src/features/offline-toast/model/use-offline-toast.ts`: `useOfflineToast()`, called once from `app`.

## Flow

`useConnectionLost` from `src/shared/lib` → `showOfflineToastHelper` → `Toast.show` with type `info`, drawn by `ToastHost`.

## Gotchas

- Fires only on a real online → offline change, not when the app starts offline.
- The site is served locally and stays on screen while offline; nothing is shown when the connection comes back.

## Related

- The page and its loading → [web-page.md](web-page.md)
