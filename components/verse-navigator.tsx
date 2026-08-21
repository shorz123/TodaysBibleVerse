import { useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { verses } from '@/data/verses';

type VerseNavigatorProps = {
  isDarkMode: boolean;
};

export function VerseNavigator({
  isDarkMode,
}: VerseNavigatorProps) {
  const [verseIndex, setVerseIndex] = useState(0);

  const currentVerse = verses[verseIndex];

  function showNextVerse() {
    setVerseIndex(function updateVerseIndex(
      currentIndex,
    ) {
      return (currentIndex + 1) % verses.length;
    });
  }

  function showPreviousVerse() {
    setVerseIndex(function updateVerseIndex(
      currentIndex,
    ) {
      return (
        currentIndex - 1 + verses.length
      ) % verses.length;
    });
  }

  const swipeResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder:
        function recognizeMovement() {
          return true;
        },

      onPanResponderRelease:
        function handleSwipeRelease(
          _event,
          gestureState,
        ) {
          if (gestureState.dx < -50) {
            showNextVerse();
          } else if (gestureState.dx > 50) {
            showPreviousVerse();
          }
        },
    }),
  ).current;

  return (
    <ThemedView style={styles.verseContainer}>
      <View
        style={styles.verseTextArea}
        {...swipeResponder.panHandlers}
      >
        <ThemedText style={styles.verseText}>
          {currentVerse.text}
        </ThemedText>

        <View
          style={[
            styles.divider,
            {
              backgroundColor: isDarkMode
                ? '#FFFFFF'
                : '#11181C',
            },
          ]}
        />

        <ThemedText style={styles.reference}>
          {currentVerse.reference}
        </ThemedText>
      </View>

      <View style={styles.navigationArea}>
        <View style={styles.referenceRow}>
          <Pressable
            accessibilityLabel="Show previous verse"
            accessibilityRole="button"
            hitSlop={16}
            onPress={showPreviousVerse}
            style={[
              styles.arrowButton,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(17, 24, 28, 0.07)',
              },
            ]}
          >
            <ThemedText style={styles.arrowText}>
              ←
            </ThemedText>
          </Pressable>

          <View style={styles.arrowSpacer}>
            <ThemedText style={styles.verseDate}>
              {formatVerseDate(currentVerse.date)}
            </ThemedText>
          </View>

          <Pressable
            accessibilityLabel="Show next verse"
            accessibilityRole="button"
            hitSlop={16}
            onPress={showNextVerse}
            style={[
              styles.arrowButton,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(17, 24, 28, 0.07)',
              },
            ]}
          >
            <ThemedText style={styles.arrowText}>
              →
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    height: 104,
    justifyContent: 'flex-end',
    marginHorizontal: -20,
    paddingBottom: 24,
  },
  verseText: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 30,
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
    borderRadius: 15,
    marginBottom: 15,
  },
  arrowText: {
    fontFamily: 'Georgia',
    fontSize: 38,
    lineHeight: 44,
  },
  arrowSpacer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  verseDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },
  reference: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
    width: 150,
    textAlign: 'center',
  },
});

function formatVerseDate(date: string) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [month, day] = date.split('-').map(Number);

  return `${monthNames[month - 1]} ${day}`;
}
