import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";

import DropDownPicker from "react-native-dropdown-picker";

import { sortInventory } from "../redux/reducers/inventoryReducers";
import { useDispatch } from "react-redux";

const Drowpdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("date,asc");
  const items = [
    {
      label: (
        <Text style={{ fontFamily: "Inter-Black", fontSize: 12 }}>Name ↑</Text>
      ),
      value: "item,asc",
      order: "asc",
    },
    {
      label: (
        <Text style={{ fontFamily: "Inter-Black", fontSize: 12 }}>Name ↓</Text>
      ),
      value: "item,desc",
      order: "desc",
    },
    {
      label: (
        <Text style={{ fontFamily: "Inter-Black", fontSize: 12 }}>Date ↑</Text>
      ),
      value: "date,asc",
      order: "asc",
    },
    {
      label: (
        <Text style={{ fontFamily: "Inter-Black", fontSize: 12 }}>Date ↓</Text>
      ),
      value: "date,desc",
      order: "desc",
    },
  ];

  const dispatch = useDispatch();
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter/InterVariable/Inter.ttf"),
  });

  useEffect(() => {
    dispatch(sortInventory(value));
  }, [value]);

  if (!fontsLoaded) return null;

  return (
    <View className="w-[105px] flex flex-row item-center justify-center">
      <DropDownPicker
        className="z-50"
        open={open}
        value={value ?? "date,asc"}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Sort by"
        placeholderStyle={{ color: "#9CA3AF" }}
        style={{
          backgroundColor: "#F3F4F6",
          borderColor: "#9CA3AF",
          borderWidth: 1,
          borderRadius: 5,
          width: 105,
        }}
        listItemContainerStyle={{
          height: 35,
          borderBottomColor: "#9CA3AF",
          borderBottomWidth: 1,
          fontFamily: "Inter-Black",
        }}
        tickIconStyle={{
          width: 15,
          height: 15,
          backgroundColor: "#9494b8",
        }}
      />
    </View>
  );
};

export default Drowpdown;
