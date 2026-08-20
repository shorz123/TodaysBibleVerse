import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { verses } from '@/data/verses';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [verseIndex, setVerseIndex] = useState(0);

  const isDarkMode = colorScheme === 'dark';
  const currentVerse = verses[verseIndex];

  function showNextVerse() {
    const nextVerseIndex = (verseIndex + 1) % verses.length;
    setVerseIndex(nextVerseIndex);
  }

  function showPreviousVerse() {
    const previousVerseIndex = (verseIndex - 1 + verses.length) % verses.length;
    setVerseIndex(previousVerseIndex);
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
          <View style={styles.verseTextArea}>
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
          </View>

          <View style={styles.navigationArea}>
            <View style={styles.referenceRow}>
              <Pressable
                accessibilityLabel="Show previous verse"
                accessibilityRole="button"
                hitSlop={16}
                onPress={showPreviousVerse}
                style={styles.arrowButton}>
                <ThemedText style={styles.arrowText}>←</ThemedText>
              </Pressable>

              <View style={styles.arrowSpacer} />

              <Pressable
                accessibilityLabel="Show next verse"
                accessibilityRole="button"
                hitSlop={16}
                onPress={showNextVerse}
                style={styles.arrowButton}>
                <ThemedText style={styles.arrowText}>→</ThemedText>
              </Pressable>
            </View>
          </View>
        </ThemedView>
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
  verseContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  verseTextArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  navigationArea: {
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 88,
    justifyContent: 'flex-end',
    marginHorizontal: -20,
    paddingBottom: 8,
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
  referenceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  arrowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    minWidth: 72,
  },
  arrowText: {
    fontFamily: 'Georgia',
    fontSize: 38,
    lineHeight: 44,
  },
  arrowSpacer: {
    flex: 1,
  },
  reference: {
    fontFamily: 'Alex Brush',
    fontStyle: 'italic',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
    width: 150,
    textAlign: 'center',
  },
});
