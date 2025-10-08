// src/context/PageTitleContext.jsx
import { createContext, useContext, useState } from 'react';

const PageTitleContext = createContext();

export const PageTitleProvider = ({ children }) => {
  const [title, setTitle] = useState('Dashboard'); // Default title

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = () => useContext(PageTitleContext);