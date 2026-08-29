import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
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
  const verseScrollView = useRef<ScrollView>(null);
  const scrollViewportHeight = useRef(0);
  const scrollContentHeight = useRef(0);
  const scrollOffset = useRef(0);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);
  const [verseIndex, setVerseIndex] = useState(
    findTodaysVerseIndex,
  );

  const currentVerse = verses[verseIndex];

  function updateScrollState(
    shouldFlashIndicator = false,
  ) {
    const remainingScrollDistance =
      scrollContentHeight.current -
      scrollViewportHeight.current -
      scrollOffset.current;

    const contentIsScrollable =
      scrollContentHeight.current >
      scrollViewportHeight.current + 1;

    setHasMoreBelow(remainingScrollDistance > 2);

    if (contentIsScrollable && shouldFlashIndicator) {
      requestAnimationFrame(
        function showScrollIndicator() {
          verseScrollView.current?.flashScrollIndicators();
        },
      );
    }
  }

  function handleScrollLayout(event: LayoutChangeEvent) {
    scrollViewportHeight.current =
      event.nativeEvent.layout.height;
    updateScrollState(true);
  }

  function handleContentSizeChange(
    _width: number,
    height: number,
  ) {
    scrollContentHeight.current = height;
    updateScrollState(true);
  }

  function handleVerseScroll(
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) {
    scrollOffset.current =
      event.nativeEvent.contentOffset.y;
    updateScrollState();
  }

  function scrollVerseToBottom() {
    verseScrollView.current?.scrollToEnd({
      animated: true,
    });
  }

  function showNextVerse() {
    scrollOffset.current = 0;
    setHasMoreBelow(false);

    verseScrollView.current?.scrollTo({
      animated: false,
      y: 0,
    });

    setVerseIndex(function updateVerseIndex(
      currentIndex,
    ) {
      return (currentIndex + 1) % verses.length;
    });
  }

  function showPreviousVerse() {
    scrollOffset.current = 0;
    setHasMoreBelow(false);

    verseScrollView.current?.scrollTo({
      animated: false,
      y: 0,
    });

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
        function recognizeHorizontalMovement(
          _event,
          gestureState,
        ) {
          const horizontalMovement = Math.abs(
            gestureState.dx,
          );
          const verticalMovement = Math.abs(
            gestureState.dy,
          );

          return (
            horizontalMovement > 10 &&
            horizontalMovement > verticalMovement
          );
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
        <ScrollView
          contentContainerStyle={styles.verseContent}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleScrollLayout}
          onScroll={handleVerseScroll}
          persistentScrollbar={Platform.OS === 'android'}
          ref={verseScrollView}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          style={styles.verseScroll}
        >
          <ThemedText style={styles.verseText}>
            {currentVerse.text}
          </ThemedText>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.20)'
                  : 'rgba(17, 24, 28, 0.16)',
              },
            ]}
          />

          <ThemedText
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={1}
            style={styles.reference}
          >
            {currentVerse.reference}
          </ThemedText>
        </ScrollView>

        {hasMoreBelow && (
          <Pressable
            accessibilityLabel="Scroll to the bottom of the verse"
            accessibilityRole="button"
            hitSlop={8}
            onPress={scrollVerseToBottom}
            style={[
              styles.scrollButton,
              {
                backgroundColor: isDarkMode
                  ? 'rgba(50, 50, 50, 0.90)'
                  : 'rgba(235, 235, 235, 0.95)',
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.18)'
                  : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            <Ionicons
              color={isDarkMode ? '#FFFFFF' : '#444444'}
              name="arrow-down"
              size={20}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.navigationArea}>
        <View style={styles.referenceRow}>
          <Pressable
            accessibilityLabel="Show previous verse"
            accessibilityRole="button"
            hitSlop={16}
            onPress={showPreviousVerse}
            style={styles.arrowButton}
          >
            <Ionicons
              color={
                isDarkMode
                  ? 'rgba(255, 255, 255, 0.20)'
                  : 'rgba(17, 24, 28, 0.16)'
              }
              name="chevron-back"
              size={48}
            />
          </Pressable>

          <View style={styles.arrowSpacer}>
            <ThemedText
              style={[
                styles.verseDate,
                currentVerse.date === getTodaysDate() &&
                styles.todaysVerseDate,
              ]}
            >
              {formatVerseDate(currentVerse.date)}
            </ThemedText>
          </View>

          <Pressable
            accessibilityLabel="Show next verse"
            accessibilityRole="button"
            hitSlop={16}
            onPress={showNextVerse}
            style={styles.arrowButton}
          >
            <Ionicons
              color={
                isDarkMode
                  ? 'rgba(255, 255, 255, 0.20)'
                  : 'rgba(17, 24, 28, 0.16)'
              }
              name="chevron-forward"
              size={48}
            />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  verseContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  verseTextArea: {
    flex: 1,
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  verseScroll: {
    alignSelf: 'stretch',
    flex: 1,
    marginHorizontal: -12,
  },
  verseContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  scrollButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    bottom: 8,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -20,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    width: 40,
  },
  navigationArea: {
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 56,
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    paddingBottom: 0,
  },
  verseText: {
    fontFamily: 'CormorantGaramond_400Regular_Italic',
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'center',
    width: '100%',
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
    minHeight: 56,
    minWidth: 56,
    marginBottom: 0,
  },
  arrowSpacer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  verseDate: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 0,
  },
  todaysVerseDate: {
    color: '#358A99',
  },
  reference: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
    maxWidth: '90%',
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

function findTodaysVerseIndex() {
  const todaysDate = getTodaysDate();

  const todaysIndex = verses.findIndex(
    function matchesTodaysDate(verse) {
      return verse.date === todaysDate;
    },
  );

  return todaysIndex >= 0 ? todaysIndex : 0;
}

function getTodaysDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(
    2,
    '0',
  );
  const day = String(today.getDate()).padStart(2, '0');

  return `${month}-${day}`;
}
