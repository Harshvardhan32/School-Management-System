import React, { useContext } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { ThemeContext } from '../utils/ThemeContext';

const MultiSelectComponent = ({ options, selectedValue, setSelectedValue }) => {

    const { darkMode } = useContext(ThemeContext);

    const customStyles = {
        searchBox: {
            border: darkMode ? '1.5px solid #6B7280' : '1.5px solid #D1D5DB',
            backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
            color: darkMode ? '#E5E7EB' : '#1F2937',
            fontSize: '14px',
            minHeight: '40px',
            borderRadius: '4px',
        },
        chips: {
            backgroundColor: darkMode ? '#4B5563' : 'rgb(81, 223, 195)',
            color: darkMode ? '#E5E7EB' : '#1F2937',
            borderRadius: '4px',
        },
        option: {
            backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
            color: darkMode ? '#E5E7EB' : '#1F2937',
            padding: '10px',
            margin: '4px 0',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease, color 0.2s ease',
        },
        optionContainer: {
            backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
            border: darkMode ? '1.5px solid #4B5563' : '1.5px solid #D1D5DB',
            borderRadius: '4px',
        },
        multiselectContainer: {
            color: darkMode ? '#E5E7EB' : '#1F2937',
        },
    };

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
            style={customStyles}
        />
    );
};

export default MultiSelectComponent;