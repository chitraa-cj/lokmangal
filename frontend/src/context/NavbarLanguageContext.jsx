import { createContext, useContext, useMemo, useState } from "react";

const NavbarLanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
});

export const NavbarLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  );

  return (
    <NavbarLanguageContext.Provider value={value}>
      {children}
    </NavbarLanguageContext.Provider>
  );
};

export const useNavbarLanguage = () => useContext(NavbarLanguageContext);
