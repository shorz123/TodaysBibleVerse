import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  cancelDailyNotification,
  scheduleDailyNotification,
} from '@/services/notifications';

const SETTINGS_KEY = 'notification-settings';

type NotificationSettings = {
  enabled?: boolean;
  hour: number;
  minute: number;
};

export default function NotificationsScreen() {
  const [reminderEnabled, setReminderEnabled] =
    useState(false);
  const [selectedTime, setSelectedTime] = useState(
    createTime(9, 0),
  );
  const [showAndroidPicker, setShowAndroidPicker] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(function loadSettingsWhenScreenOpens() {
    async function loadSettings() {
      const savedSettings = await AsyncStorage.getItem(
        SETTINGS_KEY,
      );

      if (!savedSettings) {
        return;
      }

      const settings: NotificationSettings =
        JSON.parse(savedSettings);

      setReminderEnabled(settings.enabled ?? true);
      setSelectedTime(
        createTime(settings.hour, settings.minute),
      );
    }

    loadSettings();
  }, []);

  function handleTimeChange(
    event: DateTimePickerEvent,
    newTime?: Date,
  ) {
    if (Platform.OS === 'android') {
      setShowAndroidPicker(false);
    }

    if (event.type === 'set' && newTime) {
      setSelectedTime(newTime);
    }
  }

  async function handleReminderToggle(enabled: boolean) {
    setIsSaving(true);

    try {
      if (enabled) {
        await scheduleDailyNotification(
          selectedTime.getHours(),
          selectedTime.getMinutes(),
        );
      } else {
        await cancelDailyNotification();
      }

      setReminderEnabled(enabled);
      await saveSettings(enabled);
    } catch (error) {
      if (enabled) {
        setReminderEnabled(false);
      }

      const message =
        error instanceof Error
          ? error.message
          : 'The reminder could not be updated.';

      Alert.alert('Reminder not updated', message);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveReminder() {
    setIsSaving(true);

    const settings: NotificationSettings = {
      enabled: reminderEnabled,
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
    };

    try {
      if (reminderEnabled) {
        await scheduleDailyNotification(
          settings.hour,
          settings.minute,
        );
      }

      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings),
      );

      Alert.alert(
        reminderEnabled ? 'Reminder saved' : 'Time saved',
        reminderEnabled
          ? `Your daily reminder is set for ${formatTime(
              selectedTime,
            )}.`
          : `Your preferred time is ${formatTime(
              selectedTime,
            )}. Turn on the reminder when you are ready.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'The reminder could not be saved.';

      Alert.alert('Reminder not saved', message);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveSettings(enabled: boolean) {
    const settings: NotificationSettings = {
      enabled,
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
    };

    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings),
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">
          Notifications
        </ThemedText>

        <ThemedText style={styles.description}>
          Choose when you would like to receive your daily
          Bible verse reminder.
        </ThemedText>

        <View style={styles.toggleRow}>
          <View style={styles.toggleDescription}>
            <ThemedText style={styles.toggleTitle}>
              Daily reminder
            </ThemedText>
            <ThemedText style={styles.settingDetails}>
              Receive one reminder at the selected time.
            </ThemedText>
          </View>

          <Switch
            disabled={isSaving || Platform.OS === 'web'}
            onValueChange={handleReminderToggle}
            value={reminderEnabled}
          />
        </View>

        <ThemedText style={styles.timeHeading}>
          Notification time
        </ThemedText>

        {Platform.OS === 'web' ? (
          <ThemedText style={styles.settingDetails}>
            Configure notifications on your phone.
          </ThemedText>
        ) : (
          <>
            {Platform.OS === 'android' && (
              <Pressable
                onPress={function openTimePicker() {
                  setShowAndroidPicker(true);
                }}
                style={styles.timeButton}
              >
                <ThemedText style={styles.timeText}>
                  {formatTime(selectedTime)}
                </ThemedText>
              </Pressable>
            )}

            {(Platform.OS === 'ios' ||
              showAndroidPicker) && (
              <DateTimePicker
                display={
                  Platform.OS === 'ios'
                    ? 'spinner'
                    : 'default'
                }
                mode="time"
                onChange={handleTimeChange}
                value={selectedTime}
              />
            )}
          </>
        )}

        <Pressable
          disabled={isSaving || Platform.OS === 'web'}
          onPress={saveReminder}
          style={[
            styles.saveButton,
            (isSaving || Platform.OS === 'web') &&
              styles.disabled,
          ]}
        >
          <ThemedText style={styles.saveButtonText}>
            {isSaving ? 'Saving…' : 'Save reminder'}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

function createTime(hour: number, minute: number) {
  const time = new Date();
  time.setHours(hour, minute, 0, 0);
  return time;
}

function formatTime(time: Date) {
  return time.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
  },
  description: {
    marginTop: 24,
    opacity: 0.7,
  },
  settingDetails: {
    opacity: 0.7,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 32,
  },
  toggleDescription: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  timeHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 40,
  },
  timeButton: {
    alignItems: 'center',
    borderColor: '#358A99',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#358A99',
    borderRadius: 12,
    marginTop: 32,
    padding: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});
