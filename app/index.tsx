import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

const verses = [
  {
    reference: 'Psalm 23:1',
    text: 'Yahweh is my shepherd; I shall lack nothing.',
  },
  {
    reference: 'Psalm 46:1',
    text: 'God is our refuge and strength, a very present help in trouble.',
  },
  {
    reference: 'Romans 8:28',
    text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.',
  },
  {
    reference: 'Proverbs 3:5-6',
    text: "Trust in Yahweh with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.",
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [verseIndex, setVerseIndex] = useState(0);

  const isDarkMode = colorScheme === 'dark';
  const currentVerse = verses[verseIndex];

  function showNextVerse() {
    const nextVerseIndex = (verseIndex + 1) % verses.length;
    setVerseIndex(nextVerseIndex);
  }

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

        <ThemedView style={styles.verseContainer}>
          <ThemedText style={styles.verseText}>{currentVerse.text}</ThemedText>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDarkMode ? '#FFFFFF' : '#11181C',
              },
            ]}
          />

          <ThemedText style={styles.reference}>{currentVerse.reference}</ThemedText>
        </ThemedView>

        <Pressable
          accessibilityLabel="Show next Verse"
          accessibilityRole="button"
          onPress={showNextVerse}
          style={getButtonStyle}
        >
          <ThemedText style={styles.buttonText}>Show next Verse</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

function getButtonStyle({ pressed }: PressableStateCallbackType) {
  if (pressed) {
    return [styles.button, styles.buttonPressed];
  }

  return styles.button;
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
  verseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  verseText: {
    fontFamily: 'Alex Brush',
    fontStyle: 'italic',
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
  },
  divider: {
    width: '40%',
    height: 1,
    marginTop: 20,
    opacity: 1,
  },
  reference: {
    fontFamily: 'Alex Brush',
    fontStyle: 'italic',
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 14,
    backgroundColor: '#385F48',
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
