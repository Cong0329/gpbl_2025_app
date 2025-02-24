import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/home';
import HistoryScreen from './screens/history';
import SettingsScreen from './screens/setting';
import { AutoProvider } from './screens/autoContext'
import { TimeDurationProvider } from './screens/timeDurationContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AutoProvider>
        <TimeDurationProvider>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'History') {
                  iconName = focused ? 'time' : 'time-outline';
                } else if (route.name === 'Setting') {
                  iconName = focused ? 'settings' : 'settings-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'green',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                width: '100%',
                position: 'absolute',
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Setting" component={SettingsScreen} />
          </Tab.Navigator>
        </TimeDurationProvider>
    </AutoProvider>
  );
}
