import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Replace these placeholders before publishing the app.
const ABOUT_TEXT =
  "Hello! Thank you for downloading Today's Bible Verse. This application is comprised of 366 repeating bible verses with a focus on faith fundamentals and evangelism. I hope you have found this application encouraging. If you have any questions or feedback, please email me at the address below, and I will get back to you as soon as I can.\n\nSincerely, \nTrino Ochoa";
const WEBSITE_URL = 'https://todaysbibleverse.org';
const SUPPORT_EMAIL = 'todaysbibleverse.inquiry@gmail.com';
const PRIVACY_POLICY_URL =
  'https://todaysbibleverse.org/privacy';

const WEB_ATTRIBUTION_URL =
  'https://ebible.org/find/details.php?id=engwebp';

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title">More</ThemedText>

          <View
            style={[
              styles.aboutCard,
              {
                backgroundColor: isDarkMode
                  ? '#202426'
                  : '#F3F4F6',
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>
              About &amp; Contact
            </ThemedText>
            <ThemedText style={styles.aboutText}>
              {ABOUT_TEXT}
            </ThemedText>

            <Pressable
              accessibilityRole="link"
              onPress={function openWebsite() {
                openExternalLink(WEBSITE_URL);
              }}
              style={styles.contactInformation}
            >
              <Ionicons
                color={isDarkMode ? '#B7BEC2' : '#4B5563'}
                name="globe-outline"
                size={20}
              />
              <ThemedText style={styles.contactText}>
                todaysbibleverse.org
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityHint="Opens your email app"
              accessibilityLabel="Email support"
              accessibilityRole="link"
              onPress={openSupportEmail}
              style={[
                styles.contactInformation,
                styles.emailInformation,
              ]}
            >
              <Ionicons
                color={isDarkMode ? '#B7BEC2' : '#4B5563'}
                name="mail-outline"
                size={20}
              />
              <View style={styles.emailText}>
                <ThemedText style={styles.emailTitle}>
                  Email Support
                </ThemedText>
                <ThemedText style={styles.emailAddress}>
                  {SUPPORT_EMAIL}
                </ThemedText>
              </View>
            </Pressable>
          </View>

          <ThemedText style={styles.linksHeading}>
            Links
          </ThemedText>

          <View
            style={[
              styles.linksCard,
              {
                borderColor: isDarkMode
                  ? '#343A3D'
                  : '#D1D5DB',
              },
            ]}
          >
            <MoreLink
              icon="book-outline"
              isDarkMode={isDarkMode}
              onPress={function openWebAttribution() {
                openExternalLink(WEB_ATTRIBUTION_URL);
              }}
              subtitle="World English Bible — Public Domain"
              title="Bible Translation"
            />

            <View style={styles.divider} />

            <MoreLink
              icon="shield-checkmark-outline"
              isDarkMode={isDarkMode}
              onPress={function openPrivacyPolicy() {
                openConfiguredLink(
                  PRIVACY_POLICY_URL,
                  'Privacy Policy link',
                );
              }}
              subtitle="Learn how this app handles data"
              title="Privacy Policy"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

type MoreLinkProps = {
  icon: keyof typeof Ionicons.glyphMap;
  isDarkMode: boolean;
  onPress: () => void;
  subtitle: string;
  title: string;
};

function MoreLink({
  icon,
  isDarkMode,
  onPress,
  subtitle,
  title,
}: MoreLinkProps) {
  const iconColor = isDarkMode ? '#B7BEC2' : '#4B5563';

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      style={styles.linkRow}
    >
      <Ionicons color={iconColor} name={icon} size={25} />

      <View style={styles.linkText}>
        <ThemedText style={styles.linkTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.linkSubtitle}>
          {subtitle}
        </ThemedText>
      </View>

      <Ionicons
        color={iconColor}
        name="chevron-forward"
        size={20}
      />
    </Pressable>
  );
}

function openConfiguredLink(url: string, linkName: string) {
  if (!url) {
    Alert.alert(
      `${linkName} coming soon`,
      `Add the ${linkName.toLowerCase()} near the top of app/more.tsx.`,
    );
    return;
  }

  openExternalLink(url);
}

async function openExternalLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Unable to open link',
      'Please try again later.',
    );
  }
}

function openSupportEmail() {
  const subject = encodeURIComponent(
    "Today's Bible Verse Feedback",
  );

  openExternalLink(
    `mailto:${SUPPORT_EMAIL}?subject=${subject}`,
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 720,
    padding: 24,
    paddingBottom: 40,
    width: '100%',
  },
  aboutCard: {
    borderRadius: 16,
    marginTop: 28,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  aboutText: {
    lineHeight: 23,
    marginTop: 12,
    opacity: 0.8,
  },
  contactInformation: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginTop: 18,
    minHeight: 36,
  },
  contactText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  emailInformation: {
    marginTop: 2,
  },
  emailText: {
    marginLeft: 8,
  },
  emailTitle: {
    fontWeight: '600',
  },
  emailAddress: {
    fontSize: 13,
    marginTop: 1,
    opacity: 0.7,
  },
  linksHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 30,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  linksCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 76,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  linkText: {
    flex: 1,
    marginHorizontal: 14,
  },
  linkTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  linkSubtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.65,
  },
  divider: {
    backgroundColor: '#808080',
    height: StyleSheet.hairlineWidth,
    marginLeft: 57,
    opacity: 0.35,
  },
});
