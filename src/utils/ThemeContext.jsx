import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext({
    darkMode: false,
    toggleDarkMode: () => { }
});

const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;