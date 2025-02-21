import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './_layout';

export default function App() {
  return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
  );
}