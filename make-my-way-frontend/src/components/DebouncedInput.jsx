import React, { useState, useEffect } from 'react';

/**
 * A debounced input component that calls the onChange callback after a specified delay.
 * @param {Object} props
 * @param {number} props.delay - The debounce delay in milliseconds.
 * @param {Function} props.onChange - The callback function to execute after the debounce delay, receives the current value.
 * @param {Object} props - Additional props passed to the underlying input element.
 * @returns {JSX.Element} The input element.
 */
const DebouncedInput = ({ delay = 300, onChange, value: controlledValue, ...props }) => {
    const [localValue, setLocalValue] = useState(controlledValue || '');

    // Sync local value with controlled value if provided
    useEffect(() => {
        if (controlledValue !== undefined && controlledValue !== localValue) {
            setLocalValue(controlledValue);
        }
    }, [controlledValue]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange?.(localValue);
        }, delay);

        return () => clearTimeout(timer);
    }, [localValue, delay, onChange]);

    const handleChange = (e) => {
        // Ensure e.target.value is a string, fallback to empty string if undefined
        const newValue = e.target.value ?? '';
        setLocalValue(newValue);
    };

    return <input {...props} value={localValue} onChange={handleChange} />;
};

export default DebouncedInput;