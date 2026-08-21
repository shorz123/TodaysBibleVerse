import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotificationsScreen() {
  const [dailyReminderEnabled, setDailyReminderEnabled] =
    useState(false);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">
          Notifications
        </ThemedText>

        <View style={styles.settingRow}>
          <View style={styles.settingDescription}>
            <ThemedText style={styles.settingTitle}>
              Daily reminder
            </ThemedText>

            <ThemedText style={styles.settingDetails}>
              Receive a reminder every day at 10:00 AM.
            </ThemedText>
          </View>

          <Switch
            onValueChange={setDailyReminderEnabled}
            value={dailyReminderEnabled}
          />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 24,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 32,
  },
  settingDescription: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  settingDetails: {
    opacity: 0.7,
  },
});
