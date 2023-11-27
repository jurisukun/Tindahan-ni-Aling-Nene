import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useFonts } from "expo-font";
import { selectall, deleteRecord } from "../config/sqlite";

import SearchBar from "../components/searchbar";
import Total from "./total";
import Popup from "./modal";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "react-query";

import {
  addTransaction,
  deleteTransaction,
} from "../redux/reducers/transactionReducers";

let selected = null;

const Dashboard = () => {
  const records = useSelector((state) => state.transactionStates.transactions);
  const total = useSelector((state) => state.transactionStates.total);
  const filterBy = useSelector((state) => state.transactionStates.filter);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const [selecteditem, setSelecteditem] = useState({});
  const [fontsLoaded] = useFonts({
    Rubik: require("../assets/fonts/Rubik/static/Rubik-Light.ttf"),
  });

  const { isLoading, error } = useQuery("orderdata", () =>
    selectall("transactions").then((res) => {
      dispatch(addTransaction(res._array));
    })
  );

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

  if (records.length <= 0) {
    return (
      <View className="h-full w-full justify-center items-center">
        <Text className="text-slate-400  font-semibold">No data available</Text>
      </View>
    );
  }

  const showAlert = (id) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteRecord(id)
            .then(() => {
              ToastAndroid.showWithGravityAndOffset(
                "Deleted",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );

              dispatch(deleteTransaction(selected));
            })
            .catch((err) => {
              ToastAndroid.showWithGravityAndOffset(
                "Error",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            });
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item?.id}
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "nowrap",
          height: 35,
          overflow: "hidden",
        }}
        onPress={() => {
          setSelecteditem(item);
          setIsVisible(true);
        }}
        onLongPress={() => {
          selected = item;
          showAlert(item?.id);
        }}
      >
        <Text style={styles.cell}>{item?.item}</Text>
        <Text style={styles.cell}>{`${item?.price} x ${item?.quantity} = ${
          item.price * item.quantity
        }`}</Text>
        <Text style={styles.cell}>{item?.date}</Text>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  let filteredRecords = records.filter((item) => {
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {selecteditem?.item && isVisible && (
        <Popup
          id={selecteditem?.id}
          item={selecteditem?.item}
          price={selecteditem?.price}
          date={selecteditem?.date}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          setSelecteditem={setSelecteditem}
        />
      )}

      <View
        style={{
          flexDirection: "column",
          padding: 10,
          width: "100%",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Total label={"Total"} total={total} />
        <SearchBar tablename="transactions" />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
          }}
        >
          <Text style={styles.heading}>Item</Text>
          <Text style={styles.heading}>Price</Text>
          <Text style={styles.heading}>Date</Text>
        </View>
        <FlatList
          contentContainerStyle={{
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          data={filteredRecords.reverse() ?? []}
          // keyExtractor={(item) => item?.id}
          renderItem={renderItem}
          style={styles.table}
        />
      </View>
    </View>
  );
};

const styles = {
  table: {
    height: "100%",
    width: "100%",
  },
  cell: {
    flex: 1,

    backgroundColor: "#e8e8e8",
    flexWrap: "nowrap",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    fontFamily: "Rubik",

    fontSize: 12,
  },
  heading: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    padding: 5,
    width: 100,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#9494b8",
    color: "white",
  },
};

export default Dashboard;
