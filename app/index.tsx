import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { VerseNavigator } from '@/components/verse-navigator';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { notification } = useLocalSearchParams<{
    notification?: string;
  }>();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Image
          accessibilityLabel="Today's Bible Verse"
          contentFit="contain"
          source={require('@/assets/images/todays-bible-verse-logo.png')}
          style={styles.logo}
          tintColor={isDarkMode ? '#FFFFFF' : '#11181C'}
        />

        <VerseNavigator
          isDarkMode={isDarkMode}
          key={notification ?? 'daily-verse'}
        />
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
    paddingHorizontal: 12,
  },
  logo: {
    width: '50%',
    aspectRatio: 1672 / 941,
    alignSelf: 'center',
    marginTop: 4,
  },
});
