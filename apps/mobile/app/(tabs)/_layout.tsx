import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#6C63FF',
  background: '#1A1A2E',
  surface: '#16213E',
  tabBar: '#0F3460',
  inactive: '#4A4A6A',
  text: '#E8E8F0',
};

function TabIcon({ label, active }: { label: string; active: boolean }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIconText, active ? styles.tabIconActive : styles.tabIconInactive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopColor: COLORS.surface,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Focus',
          tabBarIcon: ({ focused }) => <TabIcon label="◎" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Capture',
          tabBarIcon: ({ focused }) => <TabIcon label="+" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ focused }) => <TabIcon label="✓" active={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 18,
  },
  tabIconActive: {
    color: '#6C63FF',
  },
  tabIconInactive: {
    color: '#4A4A6A',
  },
});
