import React, { useState, useEffect } from "react"

const DebouncedInput = ({ delay = 300, onChange, value: controlledValue, ...props }) => {
  const [localValue, setLocalValue] = useState(controlledValue || "")

  // Синхронизируем только при изменении value сверху
  useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue)
    }
  }, [controlledValue])

  // Дебаунс
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(localValue)
    }, delay)
    return () => clearTimeout(timer)
  }, [localValue, delay, onChange])

  const handleChange = (e) => {
    setLocalValue(e.target.value ?? "")
  }

  return <input {...props} value={localValue} onChange={handleChange} />
}

export default DebouncedInput
