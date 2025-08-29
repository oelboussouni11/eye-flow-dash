import React, { createContext, useContext, useState, useEffect } from 'react';

interface TaxContextType {
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};

interface TaxProviderProps {
  children: React.ReactNode;
}

export const TaxProvider: React.FC<TaxProviderProps> = ({ children }) => {
  const [taxRate, setTaxRateState] = useState<number>(16); // Default 16%

  useEffect(() => {
    const savedTaxRate = localStorage.getItem('taxRate');
    if (savedTaxRate) {
      setTaxRateState(parseFloat(savedTaxRate));
    }
  }, []);

  const setTaxRate = (rate: number) => {
    setTaxRateState(rate);
    localStorage.setItem('taxRate', rate.toString());
  };

  return (
    <TaxContext.Provider value={{ taxRate, setTaxRate }}>
      {children}
    </TaxContext.Provider>
  );
};