import React, { createContext, useContext, useState } from 'react';

// Create a context for data
const DataContext = createContext();

// Provider component to wrap around the app
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null); // State to store data

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to access context data
export const useData = () => {
  return useContext(DataContext);
};
