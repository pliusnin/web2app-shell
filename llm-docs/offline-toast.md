# offline-toast

Shows the "No internet connection" toast when the connection drops while the app is open.

## Entry points

- `src/features/offline-toast/model/use-offline-toast.ts`: `useOfflineToast()`, called once from `app`.

## Flow

`useNetworkChange({ onOffline })` from `src/shared/lib` → `showOfflineToastHelper` → `Toast.show` with type `info`, drawn by `ToastHost`.

## Gotchas

- Fires only on a real online → offline change, not when the app starts offline.
- A loaded page stays on screen while offline; there is no error screen and nothing is shown when the connection comes back.

## Related

- A load that fails offline, the offline error screen, auto-reload and splash hiding offline → [web-page.md](web-page.md)
