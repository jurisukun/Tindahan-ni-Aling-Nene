import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { getotalCapitalByDate } from "../config/sqlite";
import { useSelector, useDispatch } from "react-redux";
import { addCapitalByDate } from "../redux/reducers/inventoryReducers";

const CapitalbyDay = () => {
  const dispatch = useDispatch();
  const capitalByDate = useSelector(
    (state) => state.inventoryStates.capitalByDate
  );

  const { isLoading, error } = useQuery("capitalbyydate", () => {
    getotalCapitalByDate()
      .then((res) => {
        dispatch(addCapitalByDate(res));
      })
      .catch((err) => {
        customAlert("Error", err);
      });
  });

  if (isLoading) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <Text className="text-slate-400  font-semibold ">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <Text className="text-slate-400  font-semibold">
          {`Error, ${error}`}{" "}
        </Text>
      </View>
    );
  }

  if (capitalByDate?.length === 0) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <Text className="text-slate-400  font-semibold">No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full h-full flex gap-y-2 p-4">
      {capitalByDate?.length > 0 &&
        capitalByDate.map((item, key) => {
          return (
            <Pressable
              key={key}
              className="w-full flex flex-row justify-evenly items-center border-2 border-slate-300 rounded-md h-12"
            >
              <View className="flex flex-row justify-evenly items-center w-full">
                <Text className="text-black tracking-wide text-md font-bold">
                  {item.date}
                </Text>
                <View className="flex flex-col justify-center items-center">
                  <Text className="w-full text-center text-slate-800">
                    Capital
                  </Text>
                  <Text className="text-red-400  font-semibold">
                    {`₱${item.total_capital.toFixed(2)}`}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
    </ScrollView>
  );
};

export default CapitalbyDay;
