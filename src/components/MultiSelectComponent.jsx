import React, { useContext } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { ThemeContext } from '../utils/ThemeContext';

const MultiSelectComponent = ({ options, selectedValue, setSelectedValue }) => {

    const darkModeStyles = {
        searchBox: {
            border: '2px solid #4B5563',
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            fontSize: '14px',
            minHeight: '40px',
        },
    };

    const lightModeStyles = {
        searchBox: {
            border: '2px solid #D1D5DB',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontSize: '14px',
            minHeight: '40px',
        },
    };

    const { darkMode } = useContext(ThemeContext);

    const onSelect = (selectedList) => {
        setSelectedValue(selectedList);
    };

    const onRemove = (selectedList) => {
        setSelectedValue(selectedList);
    };

    return (
        <Multiselect
            options={options}
            selectedValues={selectedValue}
            onSelect={onSelect}
            onRemove={onRemove}
            displayValue="name"
            style={darkMode ? darkModeStyles : lightModeStyles}
        />

    );
};

export default MultiSelectComponent;