import { createSlice } from "@reduxjs/toolkit";

export const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    inventory: [],
    capitalByDate: [],
    totalCapital: 0,
    totalSales: 0,
    filter: "",
  },
  reducers: {
    addInventory: (state, action) => {
      let key = 0;
      let filteredpayload = [];
      for (let item of action.payload) {
        let duplicate = null;

        state.totalCapital += Number(item.stocks) * Number(item.priceperpiece);
        state.totalSales += Number(item.stocks) * Number(item.price);

        if (state.inventory.length > 0) {
          duplicate = state.inventory.find((inventoryitem) => {
            if (
              inventoryitem.item.toLowerCase() == item.item.toLowerCase() &&
              inventoryitem.priceperpiece == Number(item.priceperpiece) &&
              inventoryitem.price == Number(item.price)
            ) {
              inventoryitem.stocks += Number(item.stocks);
              inventoryitem.capital += Number(item.capital);
              inventoryitem.date = item.date;

              return inventoryitem;
            } else {
              item.id = state.inventory.length;
            }
          });
        }

        if (!duplicate) {
          item.priceperpiece = Number(item.priceperpiece);
          item.price = Number(item.price);
          item.stocks = Number(item.stocks);
          item.capital = Number(item.capital);

          filteredpayload.push(item);
        } else {
          key -= 1;
        }
      }
      if (filteredpayload.length > 0) {
        state.inventory = state.inventory.concat(filteredpayload);
      }
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter(
        (item) => item.id !== action.payload
      );
    },
    deleteAllInventory: (state) => {
      state.inventory = [];
      state.capitalByDate = [];
      state.totalCapital = 0;
      state.totalSales = 0;
    },
    updateInventory: (state, action) => {
      state.inventory = state.inventory.map((inventoryitem) => {
        action.payload.map((item) => {
          if (item.inventoryId == inventoryitem.id) {
            inventoryitem.stocks -= Number(item.quantity);
            state.totalCapital -=
              Number(item.quantity) * Number(inventoryitem.priceperpiece);
            state.totalSales -= Number(item.quantity) * Number(item.price);
          }
        });
        return inventoryitem;
      });
    },
    editInventory: (state, action) => {
      state.inventory = state.inventory.map((inventoryitem) => {
        if (inventoryitem.id == action.payload.id) {
          if (action.payload.changepricing) {
            state.totalCapital -=
              inventoryitem.stocks * inventoryitem.priceperpiece;
            state.totalCapital +=
              action.payload.priceperpiece * action.payload.stocks;
            state.totalSales -= inventoryitem.stocks * inventoryitem.price;
            state.totalSales += action.payload.price * action.payload.stocks;
          }
          return action.payload;
        }
        return inventoryitem;
      });
    },

    sortInventory: (state, action) => {
      const [sortBy, sortDirection] = action.payload.split(",");
      if (sortDirection === "asc") {
        state.inventory = state.inventory.sort((item1, item2) => {
          return item1[sortBy].localeCompare(item2[sortBy], undefined, {
            sensitivity: "base",
          });
        });
      } else {
        state.inventory = state.inventory.sort((item1, item2) => {
          return item2[sortBy].localeCompare(item1[sortBy], undefined, {
            sensitivity: "base",
          });
        });
      }
    },
    getTotalCapital: (state) => {
      let total = 0;
      state.inventory.forEach((item) => {
        total += Number(item.priceperpiece) * Number(item.totalstocks);
      });
      state.totalCapital = total;
    },
    getTotalSales: (state) => {
      let total = 0;
      state.inventory.forEach((item) => {
        total += Number(item.price) * Number(item.totalstocks);
      });
      state.totalSales = total;
    },
    addCapitalByDate: (state, action) => {
      state.capitalByDate = action.payload;
    },
    searchInventory: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addInventory,
  deleteInventory,
  deleteAllInventory,
  updateInventory,
  editInventory,
  sortInventory,
  addCapitalByDate,
  searchInventory,
  getTotalCapital,
  getTotalSales,
} = inventorySlice.actions;
export default inventorySlice.reducer;
