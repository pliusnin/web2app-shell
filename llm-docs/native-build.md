# Native build

iOS and Android projects, native dependencies and the quirks that broke builds before. React Native 0.87, New Architecture and Hermes on.

## Prebuilt React-Core

iOS pods use the prebuilt React-Core, the RN 0.87 default. Native libs that rely on React internals missing from it break the iOS build, so check that a native lib supports the New Architecture with the prebuilt core before adding it.

- `@react-native-community/progress-view` (abandoned, used the removed `SharedImageManager`) breaks the build. Don't bring it back.
- `react-native-bottom-tabs` 1.4.0 is patched by `patch-package` (`patches/react-native-bottom-tabs+1.4.0.patch`, applied on the app's `postinstall` with `--patch-dir`) with the upstream `__has_include(<React/RCTConversions.h>)` fix. Drop the patch once a release after 1.4.0 includes it.

## iOS

- `ios/Podfile`: `use_frameworks! :linkage => :static`, `$RNFirebaseAsStaticFramework = true`, `$RNFirebaseDisableSPM = true`. Firebase comes from CocoaPods, linked statically.
- Deployment target iOS 15.5, required by `react-native-zip-archive`. `post_install` raises pods below it to 15.5: Xcode 27 rejects lower targets, e.g. of the Firebase privacy bundles.
- Firebase CocoaPods are deprecated, with no new pod versions after Oct 2026. A future RNFB upgrade means moving to SPM and dynamic linkage.
- `pod install` crashes with `Encoding::CompatibilityError` in a non-UTF-8 shell, Claude's included. Run it in `ios/` as `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install`.
- `AppDelegate.swift`: `FirebaseApp.configure()` at launch, `RNBootSplash.initWithStoryboard("BootSplash", …)` in `customize`. It declares `var window: UIWindow?` that stays nil: RNFB Messaging reads `delegate.window` on launch, and without the property the app crashes before React Native starts, leaving the launch screen up.
- `SceneDelegate.swift` creates the window and starts React Native.
- `Info.plist`: `UIBackgroundModes` has `remote-notification`, `UILaunchStoryboardName` is `BootSplash`, `UIAppFonts` lists `MaterialDesignIcons.ttf`, `NSFaceIDUsageDescription` for [biometric-login.md](biometric-login.md).
- `web2appShell.entitlements`: `aps-environment` is `development`.
- Bundle id `com.web2appshell` matches `ios/web2appShell/GoogleService-Info.plist`.
- `ios/web2appShell/webapp.zip` is in the app target's Copy Bundle Resources: the [bundled site](bundled-site.md).

## Android

- `applicationId` `com.web2appshell` matches `android/app/google-services.json`. Google Services Gradle plugin 4.4.2.
- `AndroidManifest.xml` declares `POST_NOTIFICATIONS`, the Android 13+ push permission, and `USE_BIOMETRIC`.
- `MainActivity` starts with `BootTheme` and calls `RNBootSplash.init(this, R.style.BootTheme)`; `postBootSplashTheme` is `AppTheme`.
- `android/app/src/main/assets/webapp.zip`: the [bundled site](bundled-site.md), the same file as on iOS.
- Plain HTTP to the local server: debug builds allow it everywhere (`usesCleartextTraffic`, Metro needs it); release builds only to `127.0.0.1`, by `src/release/res/xml/network_security_config.xml` set in `src/release/AndroidManifest.xml`.
- `styles.xml` sets `enforceNavigationBarContrast` to false: otherwise the system draws a scrim over the navigation bar and it no longer matches the tab bar color.
- `npm run android:apk` builds a release APK for testers (`android/app/build/outputs/apk/release/app-release.apk`): both ARM ABIs (no x86, an arm64-only build fails to install on 32-bit phones with "app isn't compatible"), signed with `debug.keystore`, so it is not for the Play Store. Gradle needs the SDK path: `android/local.properties` with `sdk.dir` (git-ignored) or `ANDROID_HOME`.

## Firebase config files

`GoogleService-Info.plist` and `google-services.json` are committed.

## Splash assets

The setup command (`scripts/setup.mjs`, run from the app root) installs the package's dependencies and then runs `react-native-bootsplash generate` with `splash` from the app's `web-app-config.json` for both platforms. It writes `assets/bootsplash` and the native splash resources, adds them to the Xcode project, and sets `UILaunchStoryboardName` in `Info.plist` and `BootTheme` on `MainActivity` in the manifest. The `RNBootSplash` init lines in `AppDelegate` and `MainActivity` are not generated. Hiding it at runtime → [web-page.md](web-page.md).
