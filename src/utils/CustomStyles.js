const customStyles = (isDarkMode) => ({
    control: (provided) => ({
        ...provided,
        backgroundColor: isDarkMode ? '#1E293B' : 'white',
        borderColor: isDarkMode ? '#6b7280' : '#d1d5db',
        borderWidth: '1.5px',
        boxShadow: 'none',
        color: isDarkMode ? '#E5E7EB' : '#1f2937',
        ':hover': {
            borderColor: isDarkMode ? '#6b7280' : '#d1d5db'
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: isDarkMode ? '#2d3748' : 'white',
        color: isDarkMode ? '#E5E7EB' : '#1f2937',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? isDarkMode
                ? '#6B7280'
                : 'rgba(81, 223, 195, 1)'
            : 'transparent',
        color: state.isSelected
            ? 'white'
            : isDarkMode
                ? '#e2e8f0'
                : '#1f2937',
        ':hover': {
            backgroundColor: isDarkMode ? '#4B5563' : 'rgba(81, 223, 195, 0.5)',
        },
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: isDarkMode ? '#E5E7EB' : '#1f2937',
        ':hover': {
            color: isDarkMode ? '#E5E7EB' : '#1f2937',
        },
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: '#E5E7EB',
    }),
    input: (provided) => ({
        ...provided,
        color: isDarkMode ? '#E5E7EB' : '#1f2937',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: isDarkMode ? '#A0AEC0' : '#6B7280',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: isDarkMode ? '#E5E7EB' : 'black',
    }),
});

export default customStyles;