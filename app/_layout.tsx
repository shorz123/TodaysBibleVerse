import { CormorantGaramond_400Regular_Italic } from '@expo-google-fonts/cormorant-garamond';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ffffff',
        }}
      >
        <Tabs.Screen
          name="index"
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
