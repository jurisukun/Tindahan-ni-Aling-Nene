import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Provider } from "react-redux";
import store from "../redux/store";

import { TabComponent } from "./tab";

import Context from "./context";
import InventoryTab from "./inventoryTab";

import MenuIcon from "../components/menuicon";
import MenuList from "../components/menu";

import { deleteAllInventory } from "../redux/reducers/inventoryReducers";
import { deleteAllTransaction } from "../redux/reducers/transactionReducers";
import { deleteAllIncome } from "../redux/reducers/incomeReducers";

import { MenuProvider } from "react-native-popup-menu";

import { createTable } from "../config/sqlite";
import { Alert } from "react-native";

const Drawer = createDrawerNavigator();
SplashScreen.preventAutoHideAsync();
createTable()
  .then((res) => {
    setTimeout(SplashScreen.hideAsync, 3000);
  })
  .catch((err) => {
    Alert.alert("Error", err.message);
  });

const DrawerMenu = () => {
  const [visible, setMenuVisible] = React.useState(false);
  const [trvisible, setTrMenuVisible] = React.useState(false);

  return (
    <NavigationContainer independent={true}>
      <Context>
        <Provider store={store}>
          <MenuProvider>
            <Drawer.Navigator>
              <Drawer.Screen
                name="Inventory"
                component={InventoryTab}
                options={{
                  headerShown: true,
                  headerRight() {
                    return visible ? (
                      <MenuList
                        visible={visible}
                        onRequestClose={() => setMenuVisible(false)}
                        menuItemText="Delete Inventory"
                        tableToDrop="inventory"
                        reducerToDispatch={[deleteAllInventory]}
                      />
                    ) : (
                      <MenuIcon onPress={() => setMenuVisible(true)} />
                    );
                  },
                }}
              />
              <Drawer.Screen
                name="Orders"
                component={TabComponent}
                options={{
                  headerShown: true,
                  headerRight() {
                    return trvisible ? (
                      <MenuList
                        visible={trvisible}
                        onRequestClose={() => setTrMenuVisible(false)}
                        menuItemText="Delete Transactions"
                        tableToDrop="transactions"
                        reducerToDispatch={[
                          deleteAllTransaction,
                          deleteAllIncome,
                        ]}
                      />
                    ) : (
                      <MenuIcon onPress={() => setTrMenuVisible(true)} />
                    );
                  },
                }}
              />
            </Drawer.Navigator>
          </MenuProvider>
        </Provider>
      </Context>
    </NavigationContainer>
  );
};

export default DrawerMenu;
