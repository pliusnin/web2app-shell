# web2app-shell

React Native shell that wraps a website into a native app: native bottom tabs, a WebView per tab, push notifications, an offline toast, a boot splash and a login that survives app restarts.

The package holds the JS code. The native setup is done once per app by hand, this README lists every step.

## Requirements

- React Native CLI app on React Native 0.87, New Architecture on, prebuilt React-Core (the 0.87 default). Expo is not supported.
- npm. The scripts call `npm` and `npx`; yarn and pnpm are not supported.
- Node 22.11 or newer.
- Xcode with CocoaPods, Android Studio.
- A Firebase project for push notifications.

## Install

1. Copy this folder to `packages/web2app-shell` of the app.
2. Create `web-app-config.json` in the app root, see [Config](#config). With `splash` set, the next step generates the boot splash too.
3. From the app root:

   ```sh
   node packages/web2app-shell/scripts/setup.mjs
   ```

   The command:
   - adds `"web2app-shell": "file:packages/web2app-shell"` to the app's `dependencies`;
   - adds every peer dependency of the package the app doesn't have yet. Native modules must be direct app dependencies: React Native autolinking reads only the app's `package.json`;
   - keeps the versions the app already has. npm fails with `ERESOLVE` if one doesn't match the package's `peerDependencies`;
   - adds `patch-package` and `patch-package --patch-dir packages/web2app-shell/patches` to the app's `postinstall`, and applies the patches once. `react-native-bottom-tabs` 1.4.0 doesn't build on iOS without the patch;
   - runs `npm install`;
   - generates the boot splash from `splash` in `web-app-config.json`, see [Boot splash](#boot-splash). Without `splash` it skips this step and says so.

   Run it again after changing the splash logo or background, or after updating the package. A rerun changes nothing that is already set.

Don't run `npm install` inside this folder: a second `node_modules` here means a second copy of `react` and `react-native`.

## Config

`web-app-config.json` in the app root:

```json
{
  "startUrl": "https://example.com/",
  "userAgentSuffix": "MyApp/1.0.0",
  "theme": {
    "primary": "#1E6FFF"
  },
  "splash": {
    "logo": "assets/splash-logo.png",
    "background": "#FFFFFF",
    "logoWidth": 160
  },
  "tabs": [
    { "title": "Home", "icon": "home", "url": "https://example.com/" },
    {
      "title": "About",
      "icon": "information",
      "url": "https://example.com/about"
    }
  ]
}
```

| Key                 | Required       | Meaning                                                                                           |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| `tabs[]`            | yes            | one bottom tab per item: `title`, `icon`, `url`                                                   |
| `tabs[].icon`       | yes            | `icon` is the name of any icon of [Material Design Icons](https://pictogrammers.com/library/mdi/) |
| `theme.primary`     | yes            | brand accent color, hex, see below. No default                                                    |
| `startUrl`          | no             | the tab with this URL opens first. Defaults to the first tab's URL                                |
| `userAgentSuffix`   | no             | appended to the WebView user agent                                                                |
| `splash.logo`       | for the splash | PNG or SVG path from the app root                                                                 |
| `splash.background` | for the splash | splash background, hex                                                                            |
| `splash.logoWidth`  | no             | logo width in dp at @1x, bootsplash default 100                                                   |

## Usage

`App.tsx`:

```tsx
import { WebAppShell } from 'web2app-shell';

import webAppConfig from './web-app-config.json';

function App() {
  return <WebAppShell config={webAppConfig} />;
}

export default App;
```

## Native setup

`<App>` below is the iOS project folder (`ios/<App>`), `<AppName>` is `name` from the app's `app.json`.

### Shared

**Firebase.** Set up `@react-native-firebase/app` and `@react-native-firebase/messaging` for iOS and Android by [their docs](https://rnfirebase.io/). On top of them the shell needs:

- `firebase.json` in the app root. The shell registers for remote messages itself and posts to the `default` channel:

  ```json
  {
    "react-native": {
      "messaging_android_notification_channel_id": "default",
      "messaging_ios_auto_register_for_remote_messages": false
    }
  }
  ```

- `ios/Podfile`, above `target '<App>' do`: React Native Firebase as static frameworks from CocoaPods, the setup the shell is built with:

  ```ruby
  $RNFirebaseDisableSPM = true
  $RNFirebaseAsStaticFramework = true
  use_frameworks! :linkage => :static
  ```

#### Boot splash

1. Set `splash` in `web-app-config.json`, see [Config](#config).
2. Run the setup command, see [Install](#install), and again after changing the logo or the background.

   It runs `react-native-bootsplash generate`. iOS: the `BootSplash` storyboard, logo and color assets added to the Xcode project, `UILaunchStoryboardName` in `Info.plist`. Android: the resources, `BootTheme` in `styles.xml`, set on `MainActivity` in the manifest.

3. The two init lines are added by hand: `AppDelegate.swift` and `MainActivity.kt` below.

The shell hides the splash once the first page or an error screen is on screen.

### iOS

**`Info.plist`**:

- the tab icon font:

  ```xml
  <key>UIAppFonts</key>
  <array>
    <string>MaterialDesignIcons.ttf</string>
  </array>
  ```

- the scene manifest, React Native starts from `SceneDelegate`:

  ```xml
  <key>UIApplicationSceneManifest</key>
  <dict>
    <key>UIApplicationSupportsMultipleScenes</key>
    <false/>
    <key>UISceneConfigurations</key>
    <dict>
      <key>UIWindowSceneSessionRoleApplication</key>
      <array>
        <dict>
          <key>UISceneConfigurationName</key>
          <string>Default Configuration</string>
          <key>UISceneDelegateClassName</key>
          <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
        </dict>
      </array>
    </dict>
  </dict>
  ```

**`SessionCookieStore.swift`**: copy `native/ios/SessionCookieStore.swift` of this package to `ios/<App>/` and add it to the app target. WebKit drops session cookies when the app is killed, so without it the user is signed out on every launch. It saves them to the app sandbox and restores them before the first page loads.

**`AppDelegate.swift`**, replacing the template one. It configures Firebase, keeps the React Native factory for `SceneDelegate`, and inits the splash:

```swift
import UIKit
import FirebaseCore
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  // Stays nil, the window lives in SceneDelegate. RNFB Messaging reads
  // `delegate.window` at launch and crashes when the property doesn't exist.
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    return true
  }

  func application(
    _ application: UIApplication,
    configurationForConnecting connectingSceneSession: UISceneSession,
    options: UIScene.ConnectionOptions
  ) -> UISceneConfiguration {
    UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
```

**`SceneDelegate.swift`**, a new file in `ios/<App>/` added to the app target. It starts React Native only after the session cookies are restored; the launch screen stays up meanwhile. Replace `<AppName>`:

```swift
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard
      let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate
    else { return }

    let window = UIWindow(windowScene: windowScene)
    self.window = window

    SessionCookieStore.shared.restore {
      appDelegate.reactNativeFactory?.startReactNative(
        withModuleName: "<AppName>",
        in: window
      )
    }
  }
}
```

### Android

**`AndroidManifest.xml`**: the Android 13+ push permission, the shell requests it at runtime:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

**`MainActivity.kt`**: the splash init, and a cookie flush. Android keeps session cookies itself but writes them to disk on a timer, so a login done right before the app is killed would be lost:

```kotlin
import android.os.Bundle
import android.webkit.CookieManager
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
  }

  override fun onPause() {
    super.onPause()
    CookieManager.getInstance().flush()
  }

  // getMainComponentName and createReactActivityDelegate stay as in the template
}
```

**Navigation bar**: the system navigation bar takes the tab bar color, light or dark with the system theme.

- `android/app/src/main/res/values/styles.xml`, in `AppTheme`:

  ```xml
  <item name="android:windowLightNavigationBar" tools:targetApi="27">@bool/light_navigation_bar</item>
  <item name="android:enforceNavigationBarContrast" tools:targetApi="29">false</item>
  ```

  with `xmlns:tools="http://schemas.android.com/tools"` on `<resources>`. Without `enforceNavigationBarContrast` the system draws a scrim over the bar.

- `res/values/bools.xml` with `<bool name="light_navigation_bar">true</bool>` and `res/values-night/bools.xml` with `false`, both inside `<resources>`.

## Build and run

```sh
cd ios && bundle exec pod install
```

Run it after the Podfile is edited, and again after any native dependency changes. `pod install` crashes with `Encoding::CompatibilityError` in a non-UTF-8 shell, then prefix it with `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`.

```sh
npm run ios
npm run android
```
