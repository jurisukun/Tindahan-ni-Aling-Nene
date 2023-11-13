export const inventoryProps = (state) => {
  return {
    inventory: state.inventory.inventory,
  };
};

export const addInventoryDispatchProps = (dispatch) => {
  return {
    addInventory: (item) => dispatch({ type: "ADD_INVENTORY", payload: item }),
  };
};
