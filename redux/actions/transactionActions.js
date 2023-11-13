export const addItem = (item) => ({
  type: "ADD_ITEM",
  payload: item,
});

export const deleteItem = (itemId) => ({
  type: "DELETE_ITEM",
  payload: itemId,
});

export const updateItem = (itemObject) => ({
  type: "UPDATE_ITEM",
  payload: itemObject,
});

export const searchItem = (itemDetails) => ({
  type: "SEARCH_ITEM",
  payload: itemDetails,
});
