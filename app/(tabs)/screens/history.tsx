import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebaseConfig";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const historyRef = ref(db, "wateringHistory");

    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHistory(historyList.reverse());
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Watering History
      </Text>
      <FlatList
        data={history}
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
