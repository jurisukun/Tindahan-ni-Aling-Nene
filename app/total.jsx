import { View, Text } from "react-native";
import React from "react";

const Total = ({ total, label }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Text className="font-bold tracking-wider text-black-500">{`${label} :`}</Text>
      <Text className="mx-2 font-extrabold">
        ₱{total.toLocaleString() ?? 0}
      </Text>
    </View>
  );
};

export default Total;
