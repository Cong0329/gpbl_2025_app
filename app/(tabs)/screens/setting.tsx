import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';


export default function SettingsScreen() {
  const [isAuto, setIsAuto] = useState(false);
  const toggleAuto = () => setIsAuto(previousState => !previousState);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text>Settings for the watering system will be configured here.</Text>
      <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: 8,
                borderRadius: 10,
                marginTop: 30,
              }}
            >
              <Text style={{ marginRight: 5 }}>Auto</Text>
              <Switch value={isAuto} onValueChange={toggleAuto} />
            </View>
    </View>
  );
}
