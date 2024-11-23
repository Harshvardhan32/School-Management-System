import React, { useContext } from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import { ThemeContext } from '../../utils/ThemeContext';
import customStyles from '../../utils/CustomStyles';

const SelectOption = ({ name, control, options, placeholder, label, defaultValue }) => {

    const { darkMode } = useContext(ThemeContext);
    const styles = customStyles(darkMode);

    // Map options to match React-Select's expected format
    const mappedOptions = options.map(option => ({
        value: option.id,
        label: option.name,
    }));


    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-sm text-gray-500">{label}</label>}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field, fieldState }) => (
                    <>
                        <Select
                            {...field}
                            options={mappedOptions}
                            placeholder={placeholder}
                            value={mappedOptions.find(option => option.value === field.value) || null}
                            onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                            onBlur={field.onBlur}
                            isSearchable
                            styles={styles}
                        />
                        {fieldState.error && (
                            <p className="text-xs text-red-700 py-2">{fieldState.error.message}</p>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default SelectOption;