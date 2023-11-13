import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Dashboard from "./login";
import Entry from "./addEntry";

import {
  useFocusEffect,
  TabActions,
  useIsFocused,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

const Tab = createBottomTabNavigator();

let transactionsTabScreen = [
  {
    name: "Add Entry",
    component: Entry,
    package: Ionicons,
    icon: "create-outline",
  },
  {
    name: "Transactions",
    component: Dashboard,
    package: Ionicons,
    icon: "document-text-outline",
  },
];

export function TabIcon({ Icon, name, size, color }) {
  return <Icon name={name} size={size} color={color} />;
}

export function TabGroup({ tabScreen }) {
  const isFocused = useIsFocused();
  const refnavigation = useNavigationContainerRef();

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused && refnavigation.isReady()) {
        refnavigation?.dispatch(TabActions.jumpTo(tabScreen[0].name));
      }
    }, [isFocused])
  );
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={refnavigation} independent={true}>
        <Tab.Navigator
          initialRouteName={tabScreen[0].name}
          screenOptions={() => {
            return {
              tabBarActiveTintColor: "#9494b8",
              tabBarInactiveTintColor: "gray",
            };
          }}
        >
          {tabScreen.map((screen, index) => {
            return (
              <Tab.Screen
                key={index}
                name={screen.name}
                component={screen.component}
                options={{
                  headerShown: false,

                  tabBarHideOnKeyboard: true,
                  tabBarIcon: ({ color, size }) => {
                    return (
                      <TabIcon
                        Icon={screen.package}
                        name={screen.icon}
                        size={size}
                        color={color}
                      />
                    );
                  },
                }}
              />
            );
          })}
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export function TabComponent() {
  return <TabGroup tabScreen={transactionsTabScreen} />;
}
