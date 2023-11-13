import { View, TextInput, StyleSheet, Button } from "react-native";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchTransaction } from "../redux/reducers/transactionReducers";
import { searchInventory } from "../redux/reducers/inventoryReducers";

const SearchBar = ({ tablename }) => {
  const dispatch = useDispatch();

  const dispatchFunction = (text) => {
    if (tablename == "transactions") {
      dispatch(searchTransaction(text));
    } else if (tablename == "inventory") {
      dispatch(searchInventory(text));
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 10,
      }}
    >
      <TextInput
        style={styles.search}
        placeholder="Search items"
        onChangeText={(text) => {
          dispatchFunction(text);
        }}
      />
      <Button title="Search" />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 5,
    width: 250,
  },
  button: {
    height: 40,
    width: 200,
  },
});
