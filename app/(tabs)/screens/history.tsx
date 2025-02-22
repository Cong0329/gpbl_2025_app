import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebaseConfig";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const historyRef = ref(db, "wateringHistory");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        historyList.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        setHistory(historyList);

        const uniqueDates = [
          "All Dates",
          ...new Set(historyList.map((item) => new Date(item.startTime).toDateString())),
        ];
        setAvailableDates(uniqueDates);
      } else {
        setHistory([]);
        setAvailableDates([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredHistory =
    selectedDate && selectedDate !== "All Dates"
      ? history.filter((item) => new Date(item.startTime).toDateString() === selectedDate)
      : history;

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 5 }}>Watering History</Text>

        <View>
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
            }}
          >
            <Text>{selectedDate || "Select Date"}</Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <View
              style={{
                position: "absolute",
                top: 35,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 5,
                zIndex: 10,
              }}
            >
              {availableDates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedDate(date);
                    setDropdownVisible(false);
                  }}
                  style={{
                    padding: 8,
                    backgroundColor: selectedDate === date ? "#ddd" : "white",
                  }}
                >
                  <Text>{date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              Start: {new Date(item.startTime).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 16 }}>
              End: {new Date(item.endTime).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 16 }}>
              Duration: {item.duration} seconds
            </Text>
          </View>
        )}
      />
    </View>
  );
}
