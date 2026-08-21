import { CormorantGaramond_400Regular_Italic } from '@expo-google-fonts/cormorant-garamond';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular_Italic,
  });

  useEffect(function listenForNotificationTaps() {
    if (Platform.OS === 'web') {
      return;
    }

    function openTodaysVerse() {
      router.replace({
        pathname: '/',
        params: {
          notification: Date.now().toString(),
        },
      });
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        openTodaysVerse,
      );

    async function handleNotificationThatOpenedApp() {
      const response =
        await Notifications.getLastNotificationResponseAsync();

      if (response) {
        openTodaysVerse();
        await Notifications.clearLastNotificationResponseAsync();
      }
    }

    handleNotificationThatOpenedApp();

    return function stopListening() {
      subscription.remove();
    };
  }, [router]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isDarkMode
            ? '#69C6D4'
            : '#216B78',
          tabBarInactiveTintColor: isDarkMode
            ? '#B7BEC2'
            : '#4B5563',
          tabBarItemStyle: {
            justifyContent: 'center',
          },
          tabBarLabelStyle: {
            marginBottom: 0,
          },
          tabBarStyle: {
            backgroundColor: isDarkMode
              ? '#151718'
              : '#FFFFFF',
            borderTopColor: isDarkMode
              ? '#2D3336'
              : '#D1D5DB',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          listeners={{
            tabPress: function handleHomeTabPress(event) {
              event.preventDefault();
              router.replace({
                pathname: '/',
                params: {
                  notification: Date.now().toString(),
                },
              });
            },
          }}
          options={{
            title: 'Home',
            tabBarIcon: function showHomeIcon({
              color,
              focused,
              size,
            }) {
              return (
                <Ionicons
                  color={color}
                  name={focused ? 'home' : 'home-outline'}
                  size={size}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: function showNotificationIcon({
              color,
              focused,
              size,
            }) {
              return (
                <Ionicons
                  color={color}
                  name={
                    focused
                      ? 'notifications'
                      : 'notifications-outline'
                  }
                  size={size}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: function showMoreIcon({
              color,
              size,
            }) {
              return (
                <Ionicons
                  color={color}
                  name="ellipsis-horizontal"
                  size={size}
                />
              );
            },
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
