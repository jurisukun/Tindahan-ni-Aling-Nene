import { TextInput, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { set } from "date-fns";

export const useDebounce = (initial, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(null);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (value == null) return;
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return [debouncedValue, setValue];
};

export const useDebounceEffect = (
  debounceValue,
  checkingFunction,
  setterParams
) => {
  useEffect(() => {
    if (debounceValue == null) return;

    checkingFunction(setterParams);
  }, [debounceValue]);
};

function DebounceInput({ value, delay, onChangeText, placeholder, debounce }) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedInputValue = useDebounce(inputValue, delay);

  useEffect(() => {
    onChangeText(debouncedInputValue);
  }, [debouncedInputValue, onChangeText]);

  return (
    <>
      <TextInput
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={placeholder}
      />
      <Text>Debounced Value: {debouncedInputValue}</Text>
    </>
  );
}

export default DebounceInput;
