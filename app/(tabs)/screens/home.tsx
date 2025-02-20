import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { db } from '@/config/firebaseConfig';
import { ref, set, update } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';


export default function HomeScreen() {
  const [humidity, setHumidity] = useState(60);
  const [temperature, setTemperature] = useState(25);
  const [showHumidity, setShowHumidity] = useState(true);
  const [gradientKey, setGradientKey] = useState(Date.now());
  
  const [selectedDuration, setSelectedDuration] = useState();
  const [durationCountdown, setDurationCountdown] = useState(null);
  const [isDurationRunning, setIsDurationRunning] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prevState) => !prevState);


  const toggleDisplay = () => setShowHumidity(prevState => !prevState);
  
  const [isSpraying, setIsSpraying] = useState(false);
  const handleSpray = () => {
    const newStatus = !isSpraying;
    setIsSpraying(newStatus);
  
    set(ref(db, 'actions/spray'), { status: newStatus ? "on" : "off" });
  };

  const [selectedTime, setSelectedTime] = useState();
  const [timeList, setTimeList] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const startCountdown = (time) => {
    let totalSeconds = parseInt(time) * 60 * 60;
    if (totalSeconds > 0) {
      setIsRunning(true);
      setCountdown(totalSeconds);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            startDurationCountdown(selectedDuration);
            return "Time's up!";
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setGradientKey(Date.now());
    }, [])
  );

  const startDurationCountdown = (time) => {
    let totalSeconds = parseInt(time);
    if (totalSeconds > 0) {
      setIsDurationRunning(true);
      setDurationCountdown(totalSeconds);
  
      const interval = setInterval(() => {
        setDurationCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsDurationRunning(false);
            return "Time's up!";
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleAutoRun = () => {
    if (!selectedTime || !selectedDuration) {
      Alert.alert("Error", "Please select both time and duration!");
      return;
    }
  
    startCountdown(selectedTime);
  };
  


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <Svg height="100%" width="100%" style={{ position: 'absolute', backgroundColor: 'transparent' }} key={gradientKey}>
          <Defs>
            <LinearGradient id={`grad-${gradientKey}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="rgb(61, 182, 30)" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="white" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#grad-${gradientKey})`} />
        </Svg>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
            marginTop: 30,
          }}
          onPress={toggleDisplay}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            {showHumidity ? 'Temperature' : 'Humidity'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 10,
            marginTop: 30,
          }}
          onPress={handleSpray}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Spray</Text>
        </TouchableOpacity>
        
        {showHumidity ? (
          <>
            <Progress.Circle
              size={200}
              progress={humidity / 100}
              showsText
              thickness={10}
              color="white"
              textStyle={{ fontSize: 18, fontWeight: 'bold' }}
              formatText={() => `${humidity}%`}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, color: 'white' }}>Humidity</Text>
            <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>
              Note: The optimal humidity for plants is 60%
            </Text>
          </>
        ) : (
          <>
            <Progress.Circle
              size={200}
              progress={temperature / 100}
              showsText
              thickness={10}
              color="rgb(255, 88, 13)"
              textStyle={{ fontSize: 18, fontWeight: 'bold' }}
              formatText={() => `${temperature}°C`}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, color: 'white' }}>Temperature</Text>
          </>
        )}
      </View>

      <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>How often</Text>

          <View style={{ width: '40%', height: 50, borderColor: '#ccc', borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
            <Picker selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)}>
              <Picker.Item label="hour" value="0" />
              <Picker.Item label="1h" value="1" />
              <Picker.Item label="2h" value="2" />
              <Picker.Item label="3h" value="3" />
              <Picker.Item label="4h" value="4" />
              <Picker.Item label="5h" value="5" />
            </Picker>
          </View>

          <TouchableOpacity onPress={() => startCountdown(parseInt(selectedTime))} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            {isRunning && <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>{countdown}s</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>How long</Text>

          <View style={{ width: '40%', height: 50, borderColor: '#ccc', borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
            <Picker selectedValue={selectedDuration} onValueChange={(itemValue) => setSelectedDuration(itemValue)}>
              <Picker.Item label="second" value="0" />
              <Picker.Item label="10s" value="10" />
              <Picker.Item label="20s" value="20" />
              <Picker.Item label="30s" value="30" />
              <Picker.Item label="40s" value="40" />
              <Picker.Item label="50s" value="50" />
            </Picker>
          </View>
          <TouchableOpacity onPress={() => startDurationCountdown(parseInt(selectedDuration))} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
            {isDurationRunning && <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>{durationCountdown}s</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: 40 }}>
          <TouchableOpacity 
            style={{ backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 25 }}
            onPress={handleAutoRun}
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>Auto Run</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
