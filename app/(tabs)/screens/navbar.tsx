import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Navbar() {
  const navigation = useNavigation();
  const route = useRoute();

  const getButtonStyle = (screenName) => {
    return route.name === screenName
      ? { color: '#4CAF50', fontWeight: 'bold' }
      : { color: 'black' };
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: 'white' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={getButtonStyle('Home')}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <Text style={getButtonStyle('History')}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text style={getButtonStyle('Settings')}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
