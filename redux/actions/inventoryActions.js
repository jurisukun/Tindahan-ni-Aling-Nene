export const addInventory = (item) => ({
  type: "ADD_INVENTORY",
  payload: item,
});
export const deleteInventory = (itemId) => ({
  type: "DELETE_INVENTORY",
  payload: itemId,
});
export const updateInventory = (itemObject) => ({
  type: "UPDATE_INVENTORY",
  payload: itemObject,
});

export const deleteAllInventory = () => ({
  typr: "DELETE_ALL_INVENTORY",
}); // no payload needed
