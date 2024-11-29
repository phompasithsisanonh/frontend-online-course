// IdContext.js
import React, { createContext, useState } from 'react';

export const IdContext = createContext();

export const IdProvider = ({ children }) => {
  const [idCarttoPayment, setIdCarttoPayment] = useState(null);
  const [startC, setStartC] = useState([]);

  
  return (
    <IdContext.Provider value={{idCarttoPayment, setIdCarttoPayment}}>
      {children}
    </IdContext.Provider>
  );
};
