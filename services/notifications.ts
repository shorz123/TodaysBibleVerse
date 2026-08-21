import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NOTIFICATION_ID_KEY = 'daily-notification-id';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification:
      async function handleNotification() {
        return {
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      },
  });
}

export async function scheduleDailyNotification(
  hour: number,
  minute: number,
) {
  if (Platform.OS === 'web') {
    throw new Error(
      'Daily notifications must be configured on a phone.',
    );
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'daily-verse',
      {
        name: 'Daily Bible verse',
        importance:
          Notifications.AndroidImportance.DEFAULT,
      },
    );
  }

  const currentPermission =
    await Notifications.getPermissionsAsync();
  let permissionStatus = currentPermission.status;

  if (permissionStatus !== 'granted') {
    const requestedPermission =
      await Notifications.requestPermissionsAsync();
    permissionStatus = requestedPermission.status;
  }

  if (permissionStatus !== 'granted') {
    throw new Error(
      'Notification permission was not granted.',
    );
  }

  await cancelDailyNotification();

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Today's Bible Verse",
        body: "Today's Bible Verse is ready. Tap to read.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId:
          Platform.OS === 'android'
            ? 'daily-verse'
            : undefined,
      },
    });

  await AsyncStorage.setItem(
    NOTIFICATION_ID_KEY,
    notificationId,
  );
}

export async function cancelDailyNotification() {
  const notificationId = await AsyncStorage.getItem(
    NOTIFICATION_ID_KEY,
  );

  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(
    notificationId,
  );
  await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
}
