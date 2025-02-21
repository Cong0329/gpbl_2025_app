import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useAuto } from './autoContext';

export default function SettingsScreen() {

  const { isAuto, setIsAuto } = useAuto();

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 15 }}>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
          padding: 15,
          borderRadius: 10,
          marginTop: 30,
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 16}}>Auto</Text>
        <Switch value={isAuto} onValueChange={setIsAuto} />
      </View>

      <TouchableOpacity
        style={{
          marginTop: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
          borderRadius: 10,
          padding: 20,
          width: '100%',
        }}
        onPress={() => alert('Open custom How Often values settings')}
      >
        <Text style={{ fontSize: 16}}>Set Custom How Often Values</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
          borderRadius: 10,
          padding: 20,
          width: '100%',
        }}
        onPress={() => alert('Open custom How Long values settings')}
      >
        <Text style={{ fontSize: 16 }}>Set Custom How Long Values</Text>
      </TouchableOpacity>

    </View>
  );
}
