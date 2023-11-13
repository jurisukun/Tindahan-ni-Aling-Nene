import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Pressable,
} from "react-native";

import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { addMultipleTransactions, deleteDatabase } from "../config/sqlite";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useDebounce, useDebounceEffect } from "../components/debounceInput";
("../components/debounceInput");

import { useSelector, useDispatch } from "react-redux";
import { addTransaction } from "../redux/reducers/transactionReducers";
import { updateInventory } from "../redux/reducers/inventoryReducers";

import { getTotalTransactionsGroupByDate } from "../config/sqlite";
import { addIncome } from "../redux/reducers/incomeReducers";

// import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

export const showAlert = (id, deleteItem) => {
  Alert.alert("Delete", "Are you sure you want to delete this item?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "OK",
      onPress: () => {
        deleteItem((prev) => {
          return prev.filter((item) => item.id !== id);
        });
        ToastAndroid.showWithGravityAndOffset(
          "Deleted",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      },
    },
  ]);
};

export const customAlert = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};

export const NewItem = ({
  inventory,
  itemdetails,
  setItemDetails,
  showValidation,
  setShowValidation,
  items,
  setItems,
}) => {
  const [itemDebounceValue, setItemDebounceValue] = useDebounce(
    itemdetails.item,
    500
  );

  // function setterfunction(objProp) {
  //   if (itemDebounceValue === null) return;
  //   checkIfInInventory(inventory, itemDebounceValue);
  //   setShowValidation(true);
  //   setItemByDetails(objProp, itemDebounceValue);
  // }

  useDebounceEffect(itemDebounceValue, getSuggestions, inventory);

  function getSuggestions(inventory) {
    setSuggestions(
      inventory.filter((item) => {
        if (itemDebounceValue.trim()) {
          return item.item
            .toLowerCase()
            .includes(itemDebounceValue.toLowerCase());
        }
      })
    );
  }

  function validate(property) {
    if (!itemdetails[property]) {
      return false;
    }
    return true;
  }

  // function checkIfInInventory(inventoryList, itemdetails) {
  //   let isInInventory = null;
  //   for (const item of inventoryList) {
  //     if (item.item === itemdetails) {
  //       isInInventory = item;
  //       break;
  //     }
  //   }

  //   if (isInInventory) {
  //     setItemByDetails("price", isInInventory?.price);
  //     setItemByDetails("inventoryId", isInInventory?.id);
  //   }

  //   if (!isInInventory) customAlert("Item is not in inventory");
  // }

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
          item[itemProperty] = newItemDetail;
        }
        return item;
      });
    });
  };

  const [suggestions, setSuggestions] = useState([]);

  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          showAlert(itemdetails.id, setItemDetails);
        }}
        className={` w-full max-w-full h-auto border-2 p-2 rounded-md my-4 flex justify-center items-center border-[#9494b8]`}
      >
        <View className="relative">
          <View className="h-[50px] w-full flex flex-row justify-center items-center ">
            <View className="flex flex-row w-[60%] jutify-center items-center px-4">
              <Text className="text-slate-700 mx-4 border-b text-center w-[70%]">
                {format(date, "MM/dd/yyyy")}
              </Text>
              <FontAwesome
                name="calendar"
                size={24}
                color="#9494b8"
                onPress={showDatepicker}
              />
            </View>
            <View className="flex flex-row justify-center items-center w-[45%] px-4">
              <Text className="text-center" style={style.text}>
                Qty.
              </Text>
              <TextInput
                id="price"
                defaultValue={itemdetails?.quantity.toString()}
                onChangeText={(text) => {
                  setShowValidation(true);
                  setItemByDetails("quantity", text);
                }}
                keyboardType="numeric"
                className={`h-8 w-8 mx-2 text-center ${
                  showValidation && !validate("quantity")
                    ? "border-b-2 border-red-400"
                    : "border-b border-b-slate-900"
                }`}
                placeholder="Qty"
              />
            </View>
          </View>

          <View className=" flex flex-row justifyy-center  max-w-full w-full">
            <View className="  flex flex-col justify-center items-center  px-2 w-[55%]">
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
              {
                suggestions.length > 0 && (
                  // <Menu
                  //   className="w-auto"
                  //   visible={true}
                  //   onRequestClose={() => {
                  //     setSuggestions([]);
                  //   }}
                  // >
                  //   {suggestions.map((item, key) => (
                  //     <React.Fragment key={key}>
                  //       <MenuItem
                  //         className="flex flex-row gap-x-4 items-center justify-center px-2 "
                  //         onPress={() => {
                  //           setShowValidation(true);
                  //           if (
                  //             items.find(
                  //               (initem) => initem.inventoryId === item.id
                  //             )
                  //           ) {
                  //             customAlert("Items merged");
                  //             setItems((prev) => {
                  //               return prev.map((initem) => {
                  //                 if (initem.inventoryId === item.id) {
                  //                   initem.quantity += Number(
                  //                     itemdetails.quantity
                  //                   );
                  //                 }
                  //                 return initem;
                  //               });
                  //             });
                  //             setItemDetails((prev) => {
                  //               return prev.filter(
                  //                 (item) => item.id !== itemdetails.id
                  //               );
                  //             });

                  //             return;
                  //           }
                  //           setItemByDetails("item", item.item);
                  //           setItemByDetails("price", item.price);
                  //           setItemByDetails(
                  //             "priceperpiece",
                  //             item.priceperpiece
                  //           );
                  //           setItemByDetails("inventoryId", item.id);
                  //           setSuggestions([]);
                  //         }}
                  //       >
                  //         {`${item.item}   Stocks: ${item.stocks}   Price: ₱${item.priceperpiece}`}
                  //       </MenuItem>
                  //       <MenuDivider />
                  //     </React.Fragment>
                  //   ))}
                  // </Menu>
                  <Menu
                    opened={true}
                    onBackdropPress={(e) => {
                      setSuggestions([]);
                    }}
                  >
                    <MenuTrigger />
                    <MenuOptions>
                      <ScrollView className="max-h-[100px]">
                        {suggestions.map((item, key) => (
                          <MenuOption
                            onSelect={() => {
                              setShowValidation(true);
                              if (
                                items.find(
                                  (initem) => initem.inventoryId === item.id
                                )
                              ) {
                                customAlert("Items merged");
                                setItems((prev) => {
                                  return prev.map((initem) => {
                                    if (initem.inventoryId === item.id) {
                                      initem.quantity += Number(
                                        itemdetails.quantity
                                      );
                                    }
                                    return initem;
                                  });
                                });
                                setItemDetails((prev) => {
                                  return prev.filter(
                                    (item) => item.id !== itemdetails.id
                                  );
                                });

                                return;
                              }
                              setItemByDetails("item", item.item);
                              setItemByDetails("price", item.price);
                              setItemByDetails(
                                "priceperpiece",
                                item.priceperpiece
                              );
                              setItemByDetails("inventoryId", item.id);
                              setSuggestions([]);
                            }}
                            key={key}
                            className="flex flex-row gap-x-4 justify-evenly"
                          >
                            <Text className="text-start text-base font-semibold">
                              {item.item}
                            </Text>
                            <Text className="text-green-500 text-center font-semibold">{`₱${item.priceperpiece.toFixed(
                              2
                            )}`}</Text>
                            <Text
                              className={`${
                                item.stocks < 11
                                  ? "text-red-500"
                                  : "text-orange-500"
                              } font-semibold text-end`}
                            >{`Stocks: ${item.stocks}`}</Text>
                          </MenuOption>
                        ))}
                      </ScrollView>
                    </MenuOptions>
                  </Menu>
                )
                // (
                // <View className="flex flex-col items-center justify-center absolute left-0 bottom-full drop-shadow-lg w-[280px] rounded-lg p-2 backdrop-blur-lg shadow-lg bg-white max-h-[80px]">
                //   <View className="relative w-full  flex justify-center items-center">
                //     <ScrollView
                //       contentContainerStyle={{
                //         justifyContent: "center",
                //         display: "flex",
                //         flexDirection: "column",
                //         alignItems: "center",
                //       }}
                //       className=" gap-y-1 w-full z-50 "
                //     >
                //       {suggestions.map((item, key) => (
                //         <Pressable
                //           key={key}
                //           className="w-[95%] flex flex-row items-center justify-center gap-x-2 border border-slate-300 shadow-md rounded-md h-[30px] "
                //           onPress={() => {
                //             setShowValidation(true);
                //             if (
                //               items.find(
                //                 (initem) => initem.inventoryId === item.id
                //               )
                //             ) {
                //               customAlert("Items merged");
                //               setItems((prev) => {
                //                 return prev.map((initem) => {
                //                   if (initem.inventoryId === item.id) {
                //                     initem.quantity += Number(
                //                       itemdetails.quantity
                //                     );
                //                   }
                //                   return initem;
                //                 });
                //               });
                //               setItemDetails((prev) => {
                //                 return prev.filter(
                //                   (item) => item.id !== itemdetails.id
                //                 );
                //               });

                //               return;
                //             }
                //             setItemByDetails("item", item.item);
                //             setItemByDetails("price", item.price);
                //             setItemByDetails(
                //               "priceperpiece",
                //               item.priceperpiece
                //             );
                //             setItemByDetails("inventoryId", item.id);
                //             setSuggestions([]);
                //           }}
                //         >
                //           <Text className="text-base">{item?.item}</Text>
                //           <Text className="text-base">{item?.date}</Text>
                //           <Text className="text-base">
                //             {item?.stocks.toString()}
                //           </Text>
                //           <Text className="text-base">
                //             {item?.priceperpiece?.toString()}
                //           </Text>
                //           <Text className="text-base">
                //             {item?.price.toString()}
                //           </Text>
                //         </Pressable>
                //       ))}
                //     </ScrollView>
                //   </View>
                // </View>

                // )
              }
            </View>
            <View className="w-1/2 flex flex-row max-w-[50%] items-center justify-center px-2">
              <View
                className={`flex flex-col justify-center items-center w-1/2 max-w-1/2
              }`}
              >
                <Text className="overflow-x-scroll " style={style.text}>
                  Price
                </Text>
                <TextInput
                  id="price"
                  defaultValue={
                    itemdetails.price && itemdetails.quantity
                      ? (itemdetails?.price * itemdetails?.quantity).toString()
                      : null
                  }
                  editable={false}
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
                  placeholder="Price"
                />
              </View>
            </View>
            <TextInput
              onChangeText={(text) => {
                setItemDebounceValue(text);
              }}
            ></TextInput>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

//Entry Component
let now = format(new Date(Date()), "MM/dd/yyyy");

let newEntryItem = (prev) => ({
  id: prev.length,
  inventoryId: null,
  item: null,
  priceperpiece: null,
  price: null,
  quantity: 1,
  date: now,
});

const Entry = () => {
  const inventory = useSelector((state) => state.inventoryStates.inventory);
  const totalCapital = useSelector(
    (state) => state.inventoryStates.totalCapital
  );
  const dispatch = useDispatch();
  const [items, setItems] = useState([
    {
      id: 0,
      inventoryId: null,
      item: null,
      price: null,
      priceperpiece: null,
      quantity: 1,
      date: now,
    },
  ]);
  const [showValidation, setShowValidation] = useState(false);

  function addItems() {
    setItems((prev) => {
      return [...prev, newEntryItem(prev)];
    });
  }

  return (
    <View className="flex flex-col justify-center items-center w-full h-full p-4 ">
      <View className="flex w-full justify-end px-3">
        <Ionicons
          name="add-circle-sharp"
          size={32}
          color="#9494b8"
          style={{
            alignSelf: "flex-end",
          }}
          onPress={addItems}
        />
      </View>
      <ScrollView
      // className="flex rounded-sm h-auto w-[90%]"
      // contentContainerStyle={{
      //   justifyContent: "center",
      //   alignSelf: "center",
      // }}
      >
        {items?.map((item, key) => {
          return (
            <NewItem
              key={key}
              forInventoryAdding={false}
              inventory={inventory}
              itemdetails={item}
              items={items}
              setItems={setItems}
              setItemDetails={setItems}
              showValidation={showValidation}
              setShowValidation={setShowValidation}
            />
          );
        })}
      </ScrollView>
      <View className="mt-4 sticky bottom-0">
        <TouchableOpacity
          disabled={items.length < 1}
          style={style.touchable}
          onPress={() => {
            let NullItems = items.filter(
              (item) => !item.item || !item.price || !item.quantity
            );
            if (NullItems.length > 0) {
              customAlert("Please fill all the fields");
              setShowValidation(true);
              return;
            }
            let itemsInInventory = items.filter((item) => {
              return inventory.some((inventoryItem) => {
                return inventoryItem.item === item.item;
              });
            });

            if (itemsInInventory.length <= 0) {
              customAlert("Cannot find some items in inventory");
              return;
            }
            let insufficientStocks = items.filter((item) => {
              return inventory.some((inventoryItem) => {
                if (inventoryItem.item === item.item) {
                  return inventoryItem.stocks < item.quantity;
                }
              });
            });
            if (insufficientStocks.length > 0) {
              customAlert("Insufficient stocks");
              return;
            }

            addMultipleTransactions(items, inventory)
              .then((res) => {
                dispatch(addTransaction(items));

                setItems([
                  {
                    id: 0,
                    item: null,
                    price: null,
                    priceperpiece: null,
                    quantity: 1,
                    price: null,
                    date: now,
                  },
                ]);
                setShowValidation(false);
                dispatch(updateInventory(items));
                customAlert("Added");
                //update income

                getTotalTransactionsGroupByDate()
                  .then((res) => {
                    dispatch(addIncome(res._array));
                  })
                  .catch((err) => {
                    customAlert(`Error, ${err}`);
                  });
              })
              .catch((err) => {
                customAlert(`Error, ${err}`);
              });
          }}
        >
          <Text style={style.label}>ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const style = StyleSheet.create({
  text: {
    fontSize: 16,
    paddingRight: 10,
  },
  label: {
    color: "white",
    fontWeight: "800",
  },
  input: {
    height: 40,
    width: "90%",
    overflow: "hidden",
    padding: 5,
    borderRadius: 5,
  },
  touchable: {
    backgroundColor: "#9494b8",
    height: 40,
    width: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});

export default Entry;
