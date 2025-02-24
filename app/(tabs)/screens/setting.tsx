import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuto } from "./autoContext";
import { useTimeDuration } from "./timeDurationContext";
import { db } from '@/config/firebaseConfig';
import { ref, set, get, onValue } from "firebase/database";

export default function SettingsScreen() {
  const { isAuto, setIsAuto } = useAuto();
  const { addTimeOption, addDurationOption } = useTimeDuration();

  const [triggerLevel, setTriggerLevel] = useState("");
  const [stopLevel, setStopLevel] = useState("");

  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("");

  const [moisture, setMoisture] = useState(null);

  const [isThresholdEnabled, setIsThresholdEnabled] = useState(false);

  const handleAddTime = () => {
    if (newTime.trim() !== "" && !isNaN(newTime)) {
      addTimeOption(`${newTime}h`, newTime);
      setNewTime("");
    }
  };

  const handleAddDuration = () => {
    if (newDuration.trim() !== "" && !isNaN(newDuration)) {
      addDurationOption(`${newDuration}s`, newDuration);
      setNewDuration("");
    }
  };

  useEffect(() => {
    const fetchThresholds = async () => {
      const triggerSnapshot = await get(ref(db, "settings/triggerLevel"));
      const stopSnapshot = await get(ref(db, "settings/stopLevel"));

      if (triggerSnapshot.exists()) setTriggerLevel(triggerSnapshot.val().toString());
      if (stopSnapshot.exists()) setStopLevel(stopSnapshot.val().toString());
    };

    fetchThresholds();
  }, []);

  useEffect(() => {
    const moistureRef = ref(db, "Moisturepercent");

    const unsubscribe = onValue(moistureRef, (snapshot) => {
      if (snapshot.exists()) {
        const moistureValue = snapshot.val();
        setMoisture(moistureValue);

        if (isAuto) {
          if (moistureValue < parseInt(triggerLevel)) {
            set(ref(db, "actions/spray"), { status: "on" });
          } else if (moistureValue >= parseInt(stopLevel)) {
            set(ref(db, "actions/spray"), { status: "off" });
          }
        }
      }
    });

    return () => unsubscribe();
  }, [isAuto, triggerLevel, stopLevel]);

  const handleSaveThresholds = () => {
    if (triggerLevel.trim() !== "" && !isNaN(triggerLevel)) {
      set(ref(db, "settings/triggerLevel"), parseInt(triggerLevel));
    }
    if (stopLevel.trim() !== "" && !isNaN(stopLevel)) {
      set(ref(db, "settings/stopLevel"), parseInt(stopLevel));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 15, paddingTop: 30 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
            padding: 15,
            borderRadius: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16 }}>Auto</Text>
          <Switch value={isAuto} onValueChange={setIsAuto} />
        </View>

        <View 
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            borderRadius: 10,
          }}>
          <Text style={{ fontSize: 16,}}>Set Custom How Often</Text>
        </View>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
            paddingHorizontal: 15,
            paddingBottom: 10,
            borderRadius: 10,
            justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 5, padding: 10, flex: 6, }}>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={newTime}
                onChangeText={setNewTime}
                style={{ flex: 2, fontSize: 16, textAlign: "center" }}
              />
              <Text style={{ fontSize: 16, marginLeft: 5 }}>h</Text>
            </View>
            <View style={{ flex: 3 }} />
            <TouchableOpacity
              onPress={handleAddTime}
              style={{ backgroundColor: "#00CC00", padding: 10, borderRadius: 5, marginLeft: 10, flex: 2}}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Add</Text>
            </TouchableOpacity>
        </View>

        <View style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            borderRadius: 10,
          }}>
          <Text style={{ fontSize: 16 }}>Set Custom How Long</Text>
          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
            paddingHorizontal: 15,
            paddingBottom: 10,
            borderRadius: 10,
            justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 5, padding: 10, flex: 6, }}>
              <TextInput
                placeholder="0"
                keyboardType="numeric"
                value={newDuration}
                onChangeText={setNewDuration}
                style={{ flex: 2, fontSize: 16, textAlign: "center" }}
              />
              <Text style={{ fontSize: 16, marginLeft: 5 }}>s</Text>
            </View>
            <View style={{ flex: 3 }} />
            <TouchableOpacity
              onPress={handleAddDuration}
              style={{ backgroundColor: "#00CC00", padding: 10, borderRadius: 5, marginLeft: 10, flex:2 }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Add</Text>
            </TouchableOpacity>
          </View>

          <View 
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              borderRadius: 10,
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: 16 }}>Enable Trigger & Stop</Text>
            <Switch value={isThresholdEnabled} onValueChange={setIsThresholdEnabled} />
          </View>

          {isThresholdEnabled && (
            <View>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#E0E0E0",
                paddingHorizontal: 15,
                paddingBottom: 10,
                borderRadius: 10,
                justifyContent: "space-between",
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 5, padding: 10, flex: 6 }}>
                  <TextInput
                    placeholder="Trigger %"
                    keyboardType="numeric"
                    value={triggerLevel}
                    onChangeText={setTriggerLevel}
                    style={{ flex: 2, fontSize: 16, textAlign: "center" }}
                  />
                  <Text style={{ fontSize: 16, marginLeft: 5 }}>%</Text>
                </View>
                <View style={{ flex: 3 }} />
                <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 5, padding: 10, flex: 6 }}>
                  <TextInput
                    placeholder="Stop %"
                    keyboardType="numeric"
                    value={stopLevel}
                    onChangeText={setStopLevel}
                    style={{ flex: 2, fontSize: 16, textAlign: "center" }}
                  />
                  <Text style={{ fontSize: 16, marginLeft: 5 }}>%</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleSaveThresholds} 
                style={{ backgroundColor: "#00CC00", padding: 10, borderRadius: 5, marginTop: 10, marginHorizontal: 15 }}>
                <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    </TouchableWithoutFeedback>
  );
}
