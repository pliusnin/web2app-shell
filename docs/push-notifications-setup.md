# Push notifications setup

Step-by-step setup of push notifications for an app built on `web2app-shell`, from an empty Firebase account to a push on a real iPhone and Android phone. The native code changes (`AppDelegate.swift`, `Info.plist`, `Podfile`, `AndroidManifest.xml`) are in the [README](../README.md#native-setup); this guide covers the accounts, keys and consoles around them.

You need:

- a Google account for Firebase and Google Cloud;
- a paid Apple Developer Program membership, the team the app is signed with. A free Apple account can't send pushes;
- the app's iOS bundle id and Android `applicationId`, e.g. `com.example.myapp`. They must match what you register below exactly.

Everything below happens in **one** Firebase project. Most push problems come from mixing two projects: the app registered in one, the sending key from another. FCM then answers `SENDER_ID_MISMATCH`, or accepts a topic push and delivers it to nobody.

## 1. Create the Firebase project

1. Open [console.firebase.google.com](https://console.firebase.google.com) → **Create a project**.
2. Enter a name. Firebase derives the **project ID** from it, e.g. `myapp-1a2b3`. Write it down: every config file and key below must carry this ID.
3. Google Analytics is optional, pushes don't need it.
4. **Create project**.

A Firebase project is also a Google Cloud project with the same ID. Step 7 uses it in the Google Cloud console.

## 2. Register the iOS app

1. Firebase console → the project → **Project settings** (gear icon) → **General** → **Your apps** → **Add app** → **iOS**.
2. **Apple bundle ID**: the app's bundle id, the `PRODUCT_BUNDLE_IDENTIFIER` of the app target in Xcode. Nickname and App Store ID are optional.
3. **Register app** → **Download GoogleService-Info.plist**. Skip the remaining wizard steps: they describe the Firebase iOS SDK, React Native Firebase does that part.
4. In Xcode: right-click the `<App>` folder → **Add Files to "<App>"…** → pick the plist, check **Copy items if needed** and the app target.
5. Check the file: `BUNDLE_ID` is the app's bundle id, `PROJECT_ID` is the project ID from step 1.

## 3. Register the Android app

1. **Project settings** → **General** → **Add app** → **Android**.
2. **Android package name**: `applicationId` from `android/app/build.gradle`.
3. **Register app** → **Download google-services.json** → put it at `android/app/google-services.json`.
4. Add the Google Services Gradle plugin:
   - `android/build.gradle`, in `buildscript { dependencies { … } }`:

     ```gradle
     classpath("com.google.gms:google-services:4.4.2")
     ```

   - `android/app/build.gradle`, below the other `apply plugin` lines:

     ```gradle
     apply plugin: "com.google.gms.google-services"
     ```

5. Check the file: `project_info.project_id` is the project ID, `client[].client_info.android_client_info.package_name` is the `applicationId`.

Android needs no key: FCM delivers to Android itself. Skip to step 6 if you build for Android only.

## 4. Create the APNs key (iOS)

FCM can't reach an iPhone directly, it hands the push to Apple's push service (APNs). It needs a key from your Apple Developer account for that. One key works for every app of the team and for both development and App Store builds.

1. Open [developer.apple.com/account](https://developer.apple.com/account) → **Certificates, Identifiers & Profiles** → **Keys** → **+**.
2. **Key Name**: any, e.g. `FCM push`.
3. Check **Apple Push Notifications service (APNs)** → **Configure** → environment **Sandbox & Production** → **Save**.
4. **Continue** → **Register** → **Download**. You get `AuthKey_<KEY_ID>.p8`.
   - **The key can be downloaded only once.** Keep the file somewhere safe, e.g. a password manager. If it's lost, revoke the key and create a new one.
   - A team can have only a few APNs keys. If **Register** is greyed out, reuse an existing key or revoke an unused one.
5. Note two values:
   - **Key ID**: on the key's page, also in the file name;
   - **Team ID**: top right of the developer portal, or **Membership details**. It must be the team that signs the app: `DEVELOPMENT_TEAM` of the app target in Xcode.

## 5. Upload the APNs key to Firebase

1. Firebase console → **Project settings** → **Cloud Messaging**.
2. **Apple app configuration** → pick the iOS app from step 2 (with several iOS apps, every one needs its own upload).
3. **APNs Authentication Key** → **Upload** → the `.p8` file, **Key ID** and **Team ID** from step 4 → **Upload**.

Leave **APNs Certificates** empty: the key replaces them.

## 6. Enable push in the app

iOS, in Xcode, the app target → **Signing & Capabilities**:

1. **Team**: the team from step 4. Leave **Automatically manage signing** on: Xcode then adds push to the App ID and the provisioning profile.
2. **+ Capability** → **Push Notifications**. Xcode creates `<App>.entitlements` with `aps-environment`.
3. **+ Capability** → **Background Modes** → check **Remote notifications**. It writes `UIBackgroundModes` → `remote-notification` to `Info.plist`.

Then the rest of the [README native setup](../README.md#native-setup): `firebase.json` (keep `messaging_ios_auto_register_for_remote_messages` at its default), `FirebaseApp.configure()` in `AppDelegate.swift`, the Podfile, `POST_NOTIFICATIONS` in `AndroidManifest.xml`, `registerBackgroundMessageHandler()` in `index.js`.

Rebuild both apps natively after these changes (`pod install`, then `npm run ios` / `npm run android`): `firebase.json`, entitlements and Gradle plugins are read at build time, a Metro reload is not enough.

## 7. Create the service account for sending

The sender (a backend, a script or the `fcm-sender.html` page) authenticates to the FCM HTTP v1 API with a service account key of **the same project**.

### Check the API is enabled

1. Firebase console → **Project settings** → **Cloud Messaging**.
2. **Firebase Cloud Messaging API (V1)** must show **Enabled**. If not: **⋮** → **Manage API in Google Cloud Console** → **Enable**.

Ignore **Cloud Messaging API (Legacy)**: Google shut it down, the shell and the sender use V1.

### Create the account

1. Open [console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. In the project picker at the top, choose the project with the **project ID from step 1**. Check the ID, not only the name: two projects can have the same name.
3. **+ Create service account**:
   - **Service account name**: e.g. `fcm-sender`. The ID fills in itself;
   - **Create and continue**;
   - **Role**: **Firebase Cloud Messaging API Admin** (`roles/firebasecloudmessaging.admin`). It can only send pushes, nothing else in the project;
   - **Continue** → **Done**.

Don't use the `firebase-adminsdk-…@…` account Firebase creates itself: its key gives full access to the project.

### Create the key

1. Click the new account → **Keys** → **Add key** → **Create new key** → **JSON** → **Create**. The browser downloads `<project-id>-<hash>.json`.
2. Open it and check `"project_id"`: it must be the project ID from step 1, the same as `PROJECT_ID` in `GoogleService-Info.plist` and `project_id` in `google-services.json`.

If **Create new key** fails with a policy error, the Google Cloud organization blocks key creation (`iam.disableServiceAccountKeyCreation`). An organization admin has to allow it for this project.

### Keep the key safe

- Never commit it, never put it into the app or the site.
- Anyone with the file can send pushes to every user of the app. If it leaks: **Keys** → delete the key, create a new one.
- Rename it to `service-account.json` only where a tool expects that name, e.g. `send-push.js` of `web2app-send-notification`.

## 8. Send a test push

Test on a **physical iPhone**: the iOS Simulator gets no APNs token. Android emulators with Google Play work.

### Get the device's FCM token

1. Run a debug build on the device (`npm run ios -- --device`, `npm run android`) with Metro open.
2. Allow notifications when the app asks.
3. A few seconds after launch Metro logs `FCM token: …`. Only dev builds log it.

### Send to the token

Send to the token first, not to the topic: for a token FCM returns delivery errors to the sender, for a topic it answers success before it delivers.

Option A, without a key: Firebase console → **Messaging** → **Create your first campaign** → **Firebase Notification messages** → title and text → **Send test message** → paste the token → **+** → **Test**.

Option B, with the key from step 7: open `fcm-sender.html` of `web2app-send-notification` → load the JSON key → **Токен устройства** (device token) → paste the token → title, text → send.

Try it with the app in the foreground (the shell shows the notification itself), in the background and closed (the OS shows it).

### Send to the topic

The shell subscribes every install to the topic `all`. Once the token test passes, send to the topic `all` from the sender to reach every user. A new subscription can take a while to reach FCM: if the token push arrives but the topic one doesn't, retry later.

## Troubleshooting

| What you see                                          | Cause and fix                                                                                                                                                                                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SENDER_ID_MISMATCH`                                  | The sender's key is from another project than the app. Create the service account in the app's project, step 7, and compare `project_id` in the key with `PROJECT_ID` in `GoogleService-Info.plist`. |
| `THIRD_PARTY_AUTH_ERROR`                              | APNs rejected the key: wrong Key ID or Team ID, a revoked key, or a Team ID other than the one signing the app. Re-upload it, step 5.                                                                |
| `UNREGISTERED`                                        | The token is stale: the app was reinstalled or its data cleared. Take the new token from Metro.                                                                                                      |
| `PERMISSION_DENIED`                                   | The service account lacks the **Firebase Cloud Messaging API Admin** role, or the FCM V1 API is off, step 7.                                                                                         |
| `INVALID_ARGUMENT`                                    | The token is mistyped or cut, or the message is malformed.                                                                                                                                           |
| Topic push "sent", nothing arrives                    | Expected for any delivery error: test with the token, it shows the real error.                                                                                                                       |
| Metro: `No APNs token`                                | Simulator, or the build lacks the Push Notifications capability, step 6. Check the entitlement and rebuild.                                                                                          |
| Token push succeeds, nothing on screen                | Notifications are off for the app (Settings → the app → Notifications), or a Focus mode hides them.                                                                                                  |
| Android: push arrives silently in the background      | The `default` channel is missing: `channelId` in the shell and `messaging_android_notification_channel_id` in `firebase.json` must match.                                                            |
| Works in a debug build, not in TestFlight / App Store | Nothing to change with an APNs key, it covers both environments. Check the release build's provisioning profile has push, and that the app is signed by the same team.                               |
