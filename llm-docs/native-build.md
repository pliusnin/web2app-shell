# Native build

iOS and Android projects, native dependencies and the quirks that broke builds before. React Native 0.87, New Architecture and Hermes on.

## Prebuilt React-Core

iOS pods use the prebuilt React-Core, the RN 0.87 default. Native libs that rely on React internals missing from it break the iOS build, so check that a native lib supports the New Architecture with the prebuilt core before adding it.

- `@react-native-community/progress-view` (abandoned, used the removed `SharedImageManager`) was replaced by the JS `ProgressBar` in `src/shared/ui`. Don't bring it back.
- `react-native-bottom-tabs` 1.4.0 is patched by `patch-package` (`packages/web2app-shell/patches/react-native-bottom-tabs+1.4.0.patch`, applied on `postinstall` with `--patch-dir`) with the upstream `__has_include(<React/RCTConversions.h>)` fix. Drop the patch once a release after 1.4.0 includes it.

## iOS

- `ios/Podfile`: `use_frameworks! :linkage => :static`, `$RNFirebaseAsStaticFramework = true`, `$RNFirebaseDisableSPM = true`. Firebase comes from CocoaPods, linked statically.
- Firebase CocoaPods are deprecated, with no new pod versions after Oct 2026. A future RNFB upgrade means moving to SPM and dynamic linkage.
- `pod install` crashes with `Encoding::CompatibilityError` in a non-UTF-8 shell, Claude's included. Run it in `ios/` as `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install`.
- `AppDelegate.swift`: `FirebaseApp.configure()` at launch, `RNBootSplash.initWithStoryboard("BootSplash", …)` in `customize`. It declares `var window: UIWindow?` that stays nil: RNFB Messaging reads `delegate.window` on launch, and without the property the app crashes before React Native starts, leaving the launch screen up.
- `SceneDelegate.swift` starts React Native after `SessionCookieStore` restores session cookies → [cookie-persistence.md](cookie-persistence.md).
- `Info.plist`: `UIBackgroundModes` has `remote-notification`, `UILaunchStoryboardName` is `BootSplash`, `UIAppFonts` lists `MaterialDesignIcons.ttf`.
- `web2appShell.entitlements`: `aps-environment` is `development`.
- Bundle id `com.web2appshell` matches `ios/web2appShell/GoogleService-Info.plist`.

## Android

- `applicationId` `com.web2appshell` matches `android/app/google-services.json`. Google Services Gradle plugin 4.4.2.
- `AndroidManifest.xml` declares `POST_NOTIFICATIONS`, the Android 13+ push permission.
- `MainActivity` starts with `BootTheme` and calls `RNBootSplash.init(this, R.style.BootTheme)`; `postBootSplashTheme` is `AppTheme`. `onPause` flushes WebView cookies → [cookie-persistence.md](cookie-persistence.md).
- `styles.xml` sets `enforceNavigationBarContrast` to false: otherwise the system draws a scrim over the navigation bar and it no longer matches the tab bar color.
- `npm run android:apk` builds a release APK for testers (`android/app/build/outputs/apk/release/app-release.apk`): both ARM ABIs (no x86, an arm64-only build fails to install on 32-bit phones with "app isn't compatible"), signed with `debug.keystore`, so it is not for the Play Store. Gradle needs the SDK path: `android/local.properties` with `sdk.dir` (git-ignored) or `ANDROID_HOME`.

## Firebase config files

`GoogleService-Info.plist` and `google-services.json` are committed.

## Splash assets

`npm run setup` (`packages/web2app-shell/scripts/setup.mjs`) installs the package's dependencies and then runs `react-native-bootsplash generate` with `splash` from `web-app-config.json` (here `assets/splash-logo.png`, white background, 160 dp logo) for both platforms. It writes `assets/bootsplash` and the native splash resources, adds them to the Xcode project, and sets `UILaunchStoryboardName` in `Info.plist` and `BootTheme` on `MainActivity` in the manifest. The `RNBootSplash` init lines in `AppDelegate` and `MainActivity` are not generated. Hiding it at runtime → [web-page.md](web-page.md).
