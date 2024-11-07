const customStyles = (darkMode) => ({
    
    control: (base) => ({
        ...base,
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#cbd5e1' : '#1e293b',
        borderColor: darkMode ? '#475569' : '#d1d5db',
        boxShadow: 'none',
        '&:hover': {
            borderColor: darkMode ? '#64748b' : '#9ca3af'
        }
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: darkMode ? '#334155' : '#ffffff'
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? (darkMode ? '#475569' : '#e2e8f0')
            : state.isFocused
                ? (darkMode ? '#64748b' : '#f1f5f9')
                : darkMode
                    ? '#334155'
                    : '#ffffff',
        color: state.isSelected ? '#ffffff' : darkMode ? '#e2e8f0' : '#1e293b',
        '&:hover': {
            backgroundColor: darkMode ? '#475569' : '#f1f5f9'
        }
    }),
    singleValue: (base) => ({
        ...base,
        color: darkMode ? '#e2e8f0' : '#1e293b'
    })
});

export default customStyles;