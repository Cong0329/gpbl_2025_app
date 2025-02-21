import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
import { db } from '@/config/firebaseConfig';
import { ref, set, update, onValue, get, push } from "firebase/database";
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuto } from './autoContext';


export default function HomeScreen() {

  const { isAuto, setIsAuto } = useAuto();

  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [showHumidity, setShowHumidity] = useState(true);
  const gradientKey = "sensorGradient";

  
  const [selectedTime, setSelectedTime] = useState();
  const [timeList, setTimeList] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [isPause, setIsPause] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const durationRef = useRef(null);
  
  const [selectedDuration, setSelectedDuration] = useState();
  const [durationCountdown, setDurationCountdown] = useState(null);
  const [isDurationRunning, setIsDurationRunning] = useState(false);

  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const timeOptions = [
    { label: "hour", value: "0" },
    { label: "1h", value: "1" },
    { label: "2h", value: "2" },
    { label: "3h", value: "3" },
    { label: "4h", value: "4" },
    { label: "5h", value: "5" },
  ];
  
  const durationOptions = [
    { label: "second", value: "0" },
    { label: "10s", value: "10" },
    { label: "20s", value: "20" },
    { label: "30s", value: "30" },
    { label: "40s", value: "40" },
    { label: "50s", value: "50" },
  ];

  const toggleDisplay = () => setShowHumidity(prevState => !prevState);
  
  const [isSpraying, setIsSpraying] = useState(false);
  useEffect(() => {
    const sprayRef = ref(db, "actions/spray/status");

    const unsubscribe = onValue(sprayRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsSpraying(snapshot.val() === "on");
      }
    });

    return () => unsubscribe();
  }, []);
  const handleSpray = () => {
    const newStatus = !isSpraying;
    setIsSpraying(newStatus);
    
    const now = new Date().toISOString();
  
    if (newStatus) {
      set(ref(db, "actions/spray"), { status: "on" });
  
      set(ref(db, "manualWatering/startTime"), now);
    } else {
      set(ref(db, "actions/spray"), { status: "off" });
  
      get(ref(db, "manualWatering/startTime")).then((snapshot) => {
        if (snapshot.exists()) {
          const startTime = snapshot.val();
          const endTime = now;
          const duration =
            Math.round((new Date(endTime) - new Date(startTime)) / 1000);
  
          push(ref(db, "wateringHistory"), {
            startTime,
            endTime,
            duration,
          });
  
          set(ref(db, "manualWatering/startTime"), null);
        }
      });
    }
  };
  
  useEffect(() => {
    const humidityRef = ref(db, "Moisturepercent");
    const tempRef = ref(db, "Temperature");

    const unsubscribeHumidity = onValue(humidityRef, (snapshot) => {
      if (snapshot.exists()) {
        setHumidity(snapshot.val());
      }
    });

    const unsubscribeTemp = onValue(tempRef, (snapshot) => {
      if (snapshot.exists()) {
        setTemperature(snapshot.val());
      }
    });

    return () => {
      unsubscribeHumidity();
      unsubscribeTemp();
    };
  }, []);

  const startCountdown = (time) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    let totalSeconds = parseInt(time);
    if (totalSeconds > 0) {
      setIsRunning(true);
      setCountdown(totalSeconds);

      set(ref(db, 'actions/spray/status'), "off");
  
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            startDurationCountdown(selectedDuration);
            return "Time's up!";
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const startDurationCountdown = (time) => {
    if (durationRef.current) {
      clearInterval(durationRef.current);
    }
  
    let totalSeconds = parseInt(time);
    if (totalSeconds > 0) {
      setIsDurationRunning(true);
      setDurationCountdown(totalSeconds);
  
      const startTime = new Date().toISOString();
      set(ref(db, "autoWatering/startTime"), startTime);
      set(ref(db, "actions/spray/status"), "on");
  
      durationRef.current = setInterval(() => {
        setDurationCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(durationRef.current);
            setIsDurationRunning(false);
            startCountdown(selectedTime);
  
            const endTime = new Date().toISOString();
  
            push(ref(db, "wateringHistory"), {
              startTime,
              endTime,
              duration: totalSeconds,
            });
  
            return "Time's up!";
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handlePause = () => {
    if (isDurationRunning) {
      clearInterval(durationRef.current);
      setIsDurationRunning(false);
  
      const endTime = new Date().toISOString();
  
      get(ref(db, "autoWatering/startTime")).then(async (snapshot) => {
        if (snapshot.exists()) {
          const startTime = snapshot.val();
          const duration =
            Math.round((new Date(endTime) - new Date(startTime)) / 1000);
  
          push(ref(db, "wateringHistory"), {
            startTime,
            endTime,
            duration,
          });
  
          await set(ref(db, "autoWatering/startTime"), null);
        }
      });
  
      set(ref(db, "actions/spray/status"), "off");
      setIsPause(true);
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
          <Text style={{ color: isSpraying ? 'green' : 'white', fontSize: 16, fontWeight: 'bold' }}>Spray</Text>
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10, color: 'rgb(255, 88, 13)' }}>Temperature</Text>
          </>
        )}
      </View>

      <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 2 }}>How often</Text>

          <View style={{height: 50, borderColor: '#ccc', borderRadius: 5, overflow: 'hidden', justifyContent: 'center', flex: 3 }}>
            <Picker selectedValue={selectedTime} onValueChange={(itemValue) => setSelectedTime(itemValue)}>
              {timeOptions.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity onPress={() => startCountdown(parseInt(selectedTime))} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, flex: 1, }}>
            {isRunning && <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>{countdown}s</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 2  }}>How long</Text>

          <View style={{height: 50, borderColor: '#ccc', borderRadius: 5, overflow: 'hidden', justifyContent: 'center', flex: 3 }}>
            <Picker selectedValue={selectedDuration} onValueChange={(itemValue) => setSelectedDuration(itemValue)}>
              {durationOptions.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity onPress={() => startDurationCountdown(parseInt(selectedDuration))} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, flex: 1,  }}>
            {isDurationRunning && <Text style={{ marginLeft: 5, fontSize: 16, color: 'black' }}>{durationCountdown}s</Text>}
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", marginBottom: 70 }}>
          <TouchableOpacity 
            style={{ 
              backgroundColor: isAuto ? (isAutoRunning ? "gray" : "green") : "gray", 
              paddingVertical: 10, 
              paddingHorizontal: 30, 
              borderRadius: 25, 
            }}
            onPress={() => {
              if (!isAuto) return;

              if (isAutoRunning) {
                clearInterval(intervalRef.current);
                clearInterval(durationRef.current);
                setIsRunning(false);
                setIsDurationRunning(false);
                setCountdown(null);
                setDurationCountdown(null);

                set(ref(db, 'actions/spray/status'), "off"); 
                setIsSpraying(false);
              } else {
                if (!selectedTime || !selectedDuration) {
                  Alert.alert("Error", "Please select both time and duration!");
                  return;
                }
                startCountdown(selectedTime);
              }

              setIsAutoRunning(!isAutoRunning);
            }}
            disabled={!isAuto} 
          >
            <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
              {isAutoRunning ? "Pause" : "Auto Run"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}
