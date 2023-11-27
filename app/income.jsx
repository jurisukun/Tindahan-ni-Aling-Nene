import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { getTotalTransactionsGroupByDate } from "../config/sqlite";
import { useSelector, useDispatch } from "react-redux";
import { addIncome } from "../redux/reducers/incomeReducers";
import { customAlert } from "./addEntry";

const Income = ({}) => {
  const dispatch = useDispatch();
  const incomeState = useSelector((state) => state.incomeStates.incomelist);
  const { isLoading, error } = useQuery("incomedata", () => {
    getTotalTransactionsGroupByDate()
      .then((res) => {
        dispatch(addIncome(res._array));
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

  if (incomeState.length <= 0) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <Text className="text-slate-400  font-semibold">No data available</Text>
      </View>
    );
  }
  return (
    <ScrollView className="w-full h-full flex gap-y-2 p-4">
      {incomeState?.length > 0 &&
        incomeState.map((item, key) => {
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
                <View className="flex flex-col justify-center items-center">
                  <Text className="w-full text-center text-slate-800">
                    Sale
                  </Text>
                  <Text className="text-orange-400  font-semibold">
                    {`₱${item.total_transaction.toFixed(2)}`}
                  </Text>
                </View>
                <View className="flex flex-col justify-center items-center">
                  <Text className="w-full text-center text-slate-800">
                    Earnings
                  </Text>
                  <Text className="text-green-500  font-semibold">
                    {`₱${(item.total_transaction - item.total_capital).toFixed(
                      2
                    )}`}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
    </ScrollView>
  );
};

export default Income;
