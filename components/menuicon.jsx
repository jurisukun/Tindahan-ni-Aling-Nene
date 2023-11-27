import React from "react";
import { View } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function MenuIcon({ onPress }) {
  return (
    <View className=" w-[30px] flex items-center justifyy-center m-4">
      <Entypo
        name="dots-three-vertical"
        size={20}
        color="#9494b8"
        className="w-[50px] border mr-2"
        onPress={onPress}
      />
    </View>
  );
}
