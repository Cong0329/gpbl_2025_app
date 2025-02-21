import React, { createContext, useState, useContext } from 'react';

const AutoContext = createContext();

export const AutoProvider = ({ children }) => {
  const [isAuto, setIsAuto] = useState(true);

  return (
    <AutoContext.Provider value={{ isAuto, setIsAuto }}>
      {children}
    </AutoContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useAuto = () => {
  const context = useContext(AutoContext);
  if (!context) {
    throw new Error("useAuto must be used within an AutoProvider");
  }
  return context;
};
