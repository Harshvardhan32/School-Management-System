import React, { createContext, useState } from 'react';

export const ThemeContext = createContext({
    darkMode: false,
    toggleDarkMode: () => { }
});

const ThemeProvider = ({ children }) => {
    
    const existingMode = JSON.parse(localStorage.getItem('darkMode'));
    const [darkMode, setDarkMode] = useState(existingMode || false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;