import { View } from "react-native";
import React from "react";
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu";
import { deleteDatabase } from "../config/sqlite";
import { useDispatch } from "react-redux";
import { selectall } from "../config/sqlite";
import {
  addMultipleInventory,
  addMultipleTransactions,
} from "../config/sqlite";
import { addInventory } from "../redux/reducers/inventoryReducers";
import { addTransaction } from "../redux/reducers/transactionReducers";
import { deleteAllIncome } from "../redux/reducers/incomeReducers";
import { ToastAndroid, Alert } from "react-native";

import {
  cacheDirectory,
  copyAsync,
  getInfoAsync,
  makeDirectoryAsync,
  writeAsStringAsync,
  StorageAccessFramework,
  documentDirectory,
} from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { readString } from "react-native-csv";

const customAlert = (message) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};

const exportFunction = async (tablename) => {
  selectall(tablename).then(async (res) => {
    const data = res._array;
    if (data.length <= 0) {
      Alert.alert("Invalid", `No data to export`);
      return;
    }
    // Request permission to write to the document directory
    const status =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!status.granted) {
      // Handle the case where the user denies permission
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to save the file."
      );
      return;
    }

    const columnNames = Object.keys(data[0]);
    // Create the CSV content
    const csvContent = [columnNames.join(",")]
      .concat(data.map((row) => columnNames.map((col) => row[col]).join(",")))
      .join("\n");

    // await FileSystem.writeAsStringAsync(directory, csvContent);
    await StorageAccessFramework.createFileAsync(
      status.directoryUri,
      `${tablename}.csv`,
      "text/csv"
    )
      .then(async (uri) => {
        await writeAsStringAsync(uri, csvContent);
      })
      .then((res) => {
        Alert.alert("Success", `File Saved`);
      })
      .catch((err) => {
        Alert.alert("Error", `Error saving file ${err}`);
      });
  });
};

const MenuList = ({
  visible,
  onRequestClose,
  menuItemText,
  tableToDrop,
  reducerToDispatch,
}) => {
  const dispatch = useDispatch();

  const deleteInventoryFunction = () => {
    Alert.alert("Delete", "Are you sure you want to delete all data? ", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () =>
          deleteDatabase(tableToDrop)
            .then((res) => {
              reducerToDispatch.map((item) => dispatch(item()));
              customAlert("All data has been deleted");
            })
            .catch((err) => customAlert("Error Deleting Inventory Data")),
      },
    ]);
  };

  const importFunction = async (importTo) => {
    const uri = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (uri.granted) {
      const file = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
      });

      await StorageAccessFramework.readAsStringAsync(file.uri).then(
        async (csvString) => {
          const { data } = readString(csvString, { header: true });
          let functionToCall;
          let params;

          if (importTo == "inventory") {
            functionToCall = addMultipleInventory;
            params = [data];
          } else {
            functionToCall = addMultipleTransactions;
            params = [data, null, true];
          }

          functionToCall(...params)
            .then((res) => {
              Alert.alert("Success", "Data imported successfully ");
              if (tableToDrop == "inventory") {
                dispatch(addInventory(data));
              } else {
                dispatch(addTransaction(data));
                dispatch(deleteAllIncome());
              }
            })
            .catch((err) => {
              Alert.alert("Error", "Error importing data ");
            });
        }
      );
    }
  };

  return (
    <View className="relative flex items-center justify-center w-full">
      <Menu
        className="absolute translate-x-8 translate-y-4 w-[175px] flex items-center justify-center"
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <MenuItem onPress={() => exportFunction(tableToDrop)}>
          Export Data
        </MenuItem>
        <MenuItem onPress={() => importFunction(tableToDrop)}>
          Import Data
        </MenuItem>
        <MenuDivider />
        {/* {tableToDrop == "inventory" && (
          <MenuItem onPress={updateDatabase}>Update Database</MenuItem>
        )} */}
        <MenuItem onPress={deleteInventoryFunction}>{menuItemText}</MenuItem>
      </Menu>
    </View>
  );
};

export default MenuList;
