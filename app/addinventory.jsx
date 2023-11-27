import { View, Button, TouchableOpacity, Text, TextInput } from "react-native";
import React, { useState, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { addMultipleInventory } from "../config/sqlite";
import { format } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import { style, customAlert } from "./addEntry";
import { useDebounce, useDebounceEffect } from "../components/debounceInput";
import { useSelector, useDispatch } from "react-redux";
import {
  addCapitalByDate,
  addInventory,
} from "../redux/reducers/inventoryReducers";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { showAlert } from "./addEntry";
import { getotalCapitalByDate } from "../config/sqlite";

import { Fontisto } from "@expo/vector-icons";

export const NewInventoryItem = ({
  inventory,
  itemdetails,
  setItemDetails,
  showValidation,
  setShowValidation,
}) => {
  const [itemDebounceValue, setItemDebounceValue] = useDebounce(
    itemdetails.item,
    500
  );

  function setterfunction(objProp) {
    if (itemDebounceValue === null) return;
    setShowValidation(true);
    setItemByDetails(objProp, itemDebounceValue);
  }

  useDebounceEffect(itemDebounceValue, setterfunction, "item", inventory);

  function validate(property) {
    if (!itemdetails[property]) {
      return false;
    }
    return true;
  }

  const [date, setDate] = useState(new Date(Date()));

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        setDate(selectedDate);
        setItemByDetails("date", format(selectedDate, "MM/dd/yyyy"));
      },
      mode: "date",
      is24Hour: true,
      maximumDate: new Date(Date()),
    });
  };

  const setItemByDetails = (itemProperty, newItemDetail) => {
    setItemDetails((prev) => {
      return prev?.map((item) => {
        if (item?.id === itemdetails.id) {
          if (
            itemProperty === "price" ||
            itemProperty === "capital" ||
            itemProperty === "stocks" ||
            itemProperty === "priceperpiece"
          ) {
            newItemDetail = Number(newItemDetail);
            if (
              itemProperty === "stocks" &&
              (!newItemDetail || newItemDetail === "0")
            ) {
              newItemDetail = 1;
            }

            item[itemProperty] = newItemDetail;

            itemProperty === "capital" ||
            (itemProperty === "stocks" && item.stocks > 0)
              ? (item.priceperpiece = item.capital / item.stocks)
              : itemProperty === "priceperpiece" ||
                (itemProperty === "stocks" && item.stocks > 0)
              ? (item.capital = item.stocks * item.priceperpiece)
              : null;
          }

          item[itemProperty] = newItemDetail;
        }
        return item;
      });
    });
  };

  const priceRef = useRef(itemdetails.priceperpiece);
  const capitalRef = useRef(itemdetails.capital);
  const stockRef = useRef(itemdetails.stocks);

  const [stocksPlaceholder, setStocksPlaceholder] = useState(
    itemdetails.stocks.toString()
  );

  return (
    <TouchableOpacity
      onLongPress={() => {
        showAlert(itemdetails.id, setItemDetails);
      }}
      className={`w-full max-w-full h-auto border-2 p-2 rounded-md my-4 flex justify-center items-center border-[#9494b8]`}
    >
      <View className="flex flex-col justif-center items-center ">
        <View className="h-[50px] w-full flex flex-row justify-center items-center">
          <View className="flex flex-row w-[40%] jutify-center items-center px-2 gap-x-1">
            <Text className="text-slate-700  border-b text-center w-[75%] ">
              {format(date, "MM/dd/yyyy")}
            </Text>
            <FontAwesome
              name="calendar"
              size={20}
              color="#9494b8"
              onPress={showDatepicker}
            />
          </View>
          <View className="flex flex-row justify-center items-center w-[25%] px-2">
            <Text className="text-center">Pcs:</Text>
            <TextInput
              ref={stockRef}
              onChangeText={(text) => {
                setShowValidation(true);
                setItemByDetails("stocks", text);
              }}
              keyboardType="numeric"
              className={` w-10 text-center  ${
                showValidation && !validate("stocks")
                  ? "border-b-2 border-red-400"
                  : "border-b border-b-slate-900"
              }`}
              placeholder={stocksPlaceholder}
            />
          </View>
          <View className="flex flex-row justify-center items-center w-[35%] px-2 gap-x-1">
            <Text className="text-center">Amount:</Text>
            <TextInput
              ref={capitalRef}
              defaultValue={itemdetails?.capital?.toString()}
              onChangeText={(text) => {
                if (capitalRef.current.isFocused()) {
                  setShowValidation(true);
                  setItemByDetails("capital", text);
                }
              }}
              keyboardType="numeric"
              className={` w-12  text-center ${
                showValidation && !validate("capital")
                  ? "border-b-2 border-red-400"
                  : "border-b border-b-slate-900"
              }`}
              placeholder="Capital"
            />
          </View>
        </View>

        <View className="flex flex-row items-center justify-center max-w-full">
          <View className="flex flex-col justify-center items-center w-[50%]">
            <Text style={style.text}>Item </Text>
            <TextInput
              defaultValue={itemdetails.item}
              style={style.input}
              className={`${
                showValidation && !validate("item")
                  ? "border-2 border-red-400"
                  : "border border-slate-900"
              }`}
              placeholder="Enter item"
              onChangeText={(text) => {
                setItemDebounceValue(text);
              }}
              id="item"
            />
          </View>

          <View className="w-1/2 flex flex-row  items-center justify-center ">
            <View className="flex flex-col justify-center items-center w-[50%] max-w-[50%]">
              <Text style={style.text}>Php/pc</Text>
              <TextInput
                maxLength={8}
                id="capital"
                ref={priceRef}
                defaultValue={itemdetails?.priceperpiece?.toString()}
                onChangeText={(text) => {
                  if (priceRef.current.isFocused()) {
                    setShowValidation(true);
                    setItemByDetails("priceperpiece", text);
                  }
                }}
                style={style.input}
                className={`${
                  showValidation && !validate("priceperpiece")
                    ? "border-2 border-red-400"
                    : "border border-slate-900"
                } overflow-hidden`}
                placeholder="Price/pc"
              />
            </View>

            <View
              className={`flex flex-col justify-center items-center w-1/2 max-w-1/2
              }`}
            >
              <Text className="overflow-x-scroll " style={style.text}>
                Price
              </Text>
              <TextInput
                id="price"
                defaultValue={itemdetails?.price?.toString()}
                placeholder="Price"
                onChangeText={(text) => {
                  setShowValidation(true);
                  setItemByDetails("price", text);
                }}
                keyboardType="numeric"
                style={style.input}
                className={`${
                  showValidation && !validate("price")
                    ? "border-2 border-red-400"
                    : "border border-slate-900"
                }`}
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AddInventory = () => {
  const inventory = useSelector((state) => state.inventoryStates.inventory);
  const dispatch = useDispatch();
  const [newItem, setNewItem] = useState([
    {
      id: 0,
      item: null,
      price: null,
      capital: null,
      priceperpiece: null,
      stocks: 1,
      date: format(new Date(Date()), "MM/dd/yyy"),
    },
  ]);
  const [showValidation, setShowValidation] = useState(false);

  const checkNullItem = (itemsToAddInventory) => {
    for (const item of itemsToAddInventory) {
      if (
        !item.item ||
        !item.price ||
        !item.stocks ||
        !item.date ||
        !item.capital
      ) {
        setShowValidation(true);
        return {
          result: true,
          message: "Please fill in all fields",
        };
      }
      if (item.priceperpiece >= item.price) {
        setShowValidation(true);
        return {
          result: true,
          message: "Selling price must be higher than capital",
        };
      }
    }
    return false;
  };

  return (
    <View className="w-full h-full flex flex-col justify-center items-center p-4">
      <View className="w-full px-3">
        <Fontisto
          name="shopping-basket-add"
          size={24}
          color="#9494b8"
          style={{ alignSelf: "flex-end" }}
          onPress={() => {
            setNewItem([
              ...newItem,
              {
                id: newItem.length,
                item: null,
                capital: null,
                price: null,
                priceperpiece: null,
                stocks: 1,
                date: format(new Date(Date()), "MM/dd/yyy"),
              },
            ]);
          }}
        />
      </View>

      <ScrollView>
        {newItem?.map((item, key) => {
          return (
            <NewInventoryItem
              key={key}
              inventory={inventory}
              itemdetails={item}
              setItemDetails={setNewItem}
              setShowValidation={setShowValidation}
              showValidation={showValidation}
            />
          );
        })}
      </ScrollView>
      <View className="mt-4">
        <Button
          onPress={() => {
            const { result, message } = checkNullItem(newItem);
            if (result) {
              customAlert(message);
              return;
            }
            addMultipleInventory(newItem)
              .then(() => {
                getotalCapitalByDate().then((totalCapital) => {
                  dispatch(addCapitalByDate(totalCapital));
                });

                dispatch(addInventory(newItem));

                setNewItem([
                  {
                    id: 0,
                    item: null,
                    price: null,
                    capital: null,
                    priceperpiece: 0,
                    stocks: 1,
                    date: format(new Date(Date()), "MM/dd/yyy"),
                  },
                ]);
                customAlert("Successfully added to inventory");
                setShowValidation(false);
              })
              .catch((err) => {
                customAlert(err);
              });
          }}
          title="Save Inventory"
        ></Button>
      </View>
    </View>
  );
};

export default AddInventory;
