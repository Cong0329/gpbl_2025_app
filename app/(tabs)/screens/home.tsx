// HomeScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';

export default function HomeScreen() {
  const [isAuto, setIsAuto] = useState(false);
  const [humidity, setHumidity] = useState(60);
  const [temperature, setTemperature] = useState(25);

  const toggleAuto = () => setIsAuto(previousState => !previousState);
  const waterPlants = () => alert('Spray!');

  const progressBarColor = 'green'; 
  const buttonColor = 'green';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Humidity: {humidity}%</Text>
      <Progress.Bar progress={humidity / 100} width={200} color={progressBarColor} />

      <Text>Temperature: {temperature}°C</Text>
      <Progress.Bar progress={temperature / 50} width={200} color={progressBarColor} />

      <TouchableOpacity
        style={{
          backgroundColor: buttonColor,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={waterPlants}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Spray</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text>Turn on Auto mode </Text>
        <Switch value={isAuto} onValueChange={toggleAuto} />
      </View>
    </View>
  );
}
