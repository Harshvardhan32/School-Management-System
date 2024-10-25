import React, { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';

const MultiSelectComponent = ({ options, selectedValue, setSelectedValue }) => {

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
            style={{
                searchBox: {
                    border: '2px solid #D1D5DB',
                    fontSize: '14px',
                    minHeight: '40px',
                },
            }}
        />

    );
};

export default MultiSelectComponent;