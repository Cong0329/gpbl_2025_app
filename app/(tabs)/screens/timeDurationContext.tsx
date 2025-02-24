import React, { createContext, useState, useContext } from "react";

const TimeDurationContext = createContext();

export const TimeDurationProvider = ({ children }) => {
  const [timeOptions, setTimeOptions] = useState([
    { label: "hour", value: "0" },
    { label: "1h", value: "1" },
    { label: "2h", value: "2" },
    { label: "3h", value: "3" },
    { label: "4h", value: "4" },
    { label: "5h", value: "5" },
  ]);

  const [durationOptions, setDurationOptions] = useState([
    { label: "second", value: "0" },
    { label: "10s", value: "10" },
    { label: "20s", value: "20" },
    { label: "30s", value: "30" },
    { label: "40s", value: "40" },
    { label: "50s", value: "50" },
  ]);

  const addTimeOption = (label, value) => {
    setTimeOptions((prev) => [...prev, { label, value }]);
  };

  const addDurationOption = (label, value) => {
    setDurationOptions((prev) => [...prev, { label, value }]);
  };

  return (
    <TimeDurationContext.Provider
      value={{ timeOptions, durationOptions, addTimeOption, addDurationOption }}
    >
      {children}
    </TimeDurationContext.Provider>
  );
};

export const useTimeDuration = () => {
  const context = useContext(TimeDurationContext);
  if (!context) {
    throw new Error("useTimeDuration must be used within a TimeDurationProvider");
  }
  return context;
};
