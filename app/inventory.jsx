import { View, Text, FlatList, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import {
  selectall,
  deleteInventoryByDetails,
  getotalCapitalByDate,
} from "../config/sqlite";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import {
  addInventory,
  getTotalCapital,
  getTotalSales,
  addCapitalByDate,
  deleteInventory,
} from "../redux/reducers/inventoryReducers";
import { customAlert } from "./addEntry";
import InventoryModal from "../components/inventoryModal";
import Drowpdown from "../components/dropdown";
import Total from "./total";
import SearchBar from "../components/searchbar";

const Inventory = () => {
  const [toUpdate, setToUpdate] = useState();
  const inventory = useSelector((state) => state.inventoryStates.inventory);

  const totalCapital = useSelector(
    (state) => state.inventoryStates.totalCapital
  );
  const totalSales = useSelector((state) => state.inventoryStates.totalSales);
  const filterBy = useSelector((state) => state.inventoryStates.filter);

  const dispatch = useDispatch();

  const { isLoading, error } = useQuery("inventorydate", async () => {
    await selectall("inventory")
      .then((res) => {
        dispatch(addInventory(res._array));
        // dispatch(getTotalCapital());
        // dispatch(getTotalSales());
      })
      .catch((err) => {
        customAlert("Error", err);
      });
  });

  if (isLoading)
    return (
      <View className="h-full w-full justify-center items-center">
        <Text className="text-center text-lg tracking-wider font-semibold text-slate-400">
          Loading...
        </Text>
      </View>
    );

  if (error)
    return (
      <View className="h-full w-full justify-center items-center">
        <Text className="text-center text-sm tracking-wider text-slate-400">{`An error has occurred: ${error?.message}`}</Text>
      </View>
    );

  if (inventory.length <= 0) {
    return (
      <View className="h-full w-full justify-center items-center">
        <Text className="text-slate-400  font-semibold">No data available</Text>
      </View>
    );
  }

  let filteredRecords = inventory.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "string" && filterBy) {
        return value.toLowerCase().includes(filterBy.toLowerCase());
      }
      if (typeof value === "number" && filterBy) {
        return value.toString().includes(filterBy);
      }
      return item;
    });
  });

  function deleteAlert(item) {
    Alert.alert("Delete", "Do you want to this delete item in inventory?", [
      {
        text: "Cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          deleteInventoryByDetails({
            item: item.item,
            price: item.price,
            priceperpiece: item.priceperpiece,
          })
            .then(() => {
              customAlert("Item deleted");
              dispatch(deleteInventory(item.id));
              getotalCapitalByDate().then((totalCapital) => {
                dispatch(addCapitalByDate(totalCapital));
              });
            })
            .catch((err) => {
              customAlert(err);
            });
        },
      },
    ]);
  }

  let renderItem = ({ item, key }) => {
    return (
      <Pressable
        key={key}
        style={{
          minWidth: "90%",
          width: "90%",
          maxWidth: "90%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "nowrap",
          height: 45,
          overflow: "hidden",
          borderWidth: 2,
          borderRadius: 5,
          borderColor: "#9494b8",
          columnGap: 20,
          padding: 5,
        }}
        onPress={() => {
          setToUpdate(item);
        }}
        onLongPress={() => {
          deleteAlert(item);
        }}
      >
        <View className="flex flex-row max-w-[130px] flex-nowrap overflow-hidden h-full items-center justify-center">
          <Text
            numberOfLines={1}
            // ellipsizeMode="tail"
            className="text-slate-900  font-bold text-sm text-start whitespace-nowrap w-full flex-nowrap   overflow-hidden"
          >
            {item?.item}
          </Text>
        </View>

        <View className="flex flex-col items-center justify-center">
          <Text className="text-slate-600">Capital </Text>
          <Text className="font-semibold">{`₱${item?.priceperpiece?.toFixed(
            2
          )}`}</Text>
        </View>
        <View className="flex flex-col items-center justify-center">
          <Text className="text-slate-600 ">Sell </Text>
          <Text className="font-semibold">{`₱${item?.price}`}</Text>
        </View>
        <View className="flex flex-col items-center justify-center">
          <Text className="text-slate-600 ">Stocks </Text>
          <Text
            className={`${
              item.stocks <= 10 ? "text-red-500" : "text-green-600"
            } font-semibold`}
          >
            {item?.stocks}
          </Text>
        </View>
      </Pressable>
    );
  };
  return (
    <>
      {toUpdate && (
        <InventoryModal
          toUpdateDetails={toUpdate}
          setToUpdateDetails={setToUpdate}
        />
      )}

      <View className="flex h-full w-full justify-center items-center py-4">
        <View className=" flex w-full flex-row gap-x-8 justify-center mb-4 items-center">
          <View>
            <Total label={"Total Capital"} total={totalCapital} />
            <Total label={"Expected Sales"} total={totalSales} />
          </View>
          <Drowpdown />
        </View>
        <SearchBar tablename="inventory" />
        {inventory.length > 0 && (
          <FlatList
            contentContainerStyle={{
              flexWrap: "nowrap",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginVertical: 10,
              padding: 5,
              gap: 10,
            }}
            data={inventory.length > 0 ? filteredRecords : []}
            renderItem={renderItem}
          />
        )}
      </View>
    </>
  );
};

export default Inventory;
