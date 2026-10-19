import {
  getMessaging,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

/**
 * Регистрирует устройство в APNs и ждёт его токен, чтобы FCM смог создать
 * свой токен, а подписка на топик не падала на iOS.
 * На Android резолвится сразу.
 */
export const registerForRemoteMessagesHelper = () =>
  registerDeviceForRemoteMessages(getMessaging());
