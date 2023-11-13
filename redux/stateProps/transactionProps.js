export const transactionProps = (state) => {
  return {
    records: state.transactions,
    total: state.transactions.total,
    filterBy: state.transactions.filter,
  };
};

export const addItemDisPathchProps = (dispatch) => {
  return {
    addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
  };
};

export const deleteItemDisPathchProps = (dispatch) => {
  return {
    deleteItem: (id) => dispatch({ type: "DELETE_ITEM", payload: id }),
  };
};

export const deleteAllItemDisPathchProps = (dispatch) => {
  return {
    deleteAllItems: () => dispatch({ type: "DELETE_ALL_ITEMS" }),
  };
};

export const updateItemDisPathchProps = (dispatch) => {
  return {
    updateItem: (id) => dispatch({ type: "UPDATE_ITEM", payload: id }),
  };
};
