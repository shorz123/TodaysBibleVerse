import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { VerseNavigator } from '@/components/verse-navigator';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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

        <VerseNavigator isDarkMode={isDarkMode} />
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
    paddingHorizontal: 24,
  },
  logo: {
    width: '50%',
    aspectRatio: 1672 / 941,
    alignSelf: 'center',
    marginTop: 24,
  },
});
