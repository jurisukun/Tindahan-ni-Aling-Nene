import Inventory from "./inventory";
import AddInventory from "./addinventory";
import CapitalbyDay from "../components/capitalbyday";
import { Fontisto } from "@expo/vector-icons";
import { TabGroup } from "./tab";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const inventoryTabScreen = [
  {
    name: "Stocks",
    component: Inventory,
    package: Ionicons,
    icon: "bar-chart-outline",
  },
  {
    name: "Add Stocks",
    component: AddInventory,
    package: MaterialIcons,
    icon: "addchart",
  },

  {
    name: "Capital/Day",
    component: CapitalbyDay,
    package: Fontisto,
    icon: "money-symbol",
  },
];
function InventoryTab() {
  return <TabGroup tabScreen={inventoryTabScreen} />;
}

export default InventoryTab;
