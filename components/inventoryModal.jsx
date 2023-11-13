import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import React from "react";
import { inventoryUpdate } from "../config/sqlite";
import { customAlert } from "../app/addEntry";
import { useDispatch } from "react-redux";
import { editInventory } from "../redux/reducers/inventoryReducers";

function InventoryModal({ toUpdateDetails, setToUpdateDetails }) {
  const dispatch = useDispatch();
  const [updatedDetails, setUpdatedDetails] = React.useState({
    id: toUpdateDetails?.id,
    item: toUpdateDetails?.item,
    capital: toUpdateDetails?.capital,
    price: toUpdateDetails?.price,
    priceperpiece: toUpdateDetails?.priceperpiece,
    stocks: toUpdateDetails?.stocks,
    date: toUpdateDetails?.date,
  });
  const [prevstocks, setPrevStocks] = React.useState(toUpdateDetails?.stocks);
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Item: </Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => {
                  setUpdatedDetails({ ...updatedDetails, item: e });
                }}
                defaultValue={toUpdateDetails?.item}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Capital: </Text>
              <TextInput
                onChangeText={(e) => {
                  setUpdatedDetails({
                    ...updatedDetails,
                    capital: Number(e),
                  });
                }}
                style={styles.input}
                keyboardType="numeric"
                defaultValue={toUpdateDetails?.capital?.toString()}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Stocks:</Text>
              <TextInput
                onChangeText={(e) => {
                  setUpdatedDetails({
                    ...updatedDetails,
                    stocks: Number(e),
                  });
                }}
                style={styles.input}
                keyboardType="numeric"
                defaultValue={toUpdateDetails?.stocks?.toString()}
              ></TextInput>
            </View>
            <View className="flex flex-row w-full justify-center items-center m-2 ">
              <View className=" flex flex-row w-1/2  justify-center items-center">
                <Text>Price/pc: </Text>
                <TextInput
                  className="w-1/2 h-[30px] border border-black rounded-md px-2"
                  onChangeText={(e) => {
                    setUpdatedDetails({
                      ...toUpdateDetails,
                      priceperpiece: Number(e),
                    });
                  }}
                  keyboardType="numeric"
                  defaultValue={toUpdateDetails?.priceperpiece?.toFixed(2)}
                ></TextInput>
              </View>
              <View className="flex flex-row w-1/2 justify-center items-center">
                <Text>Sell: </Text>
                <TextInput
                  className="w-1/2 h-[30px] border border-black rounded-md px-2"
                  keyboardType="numeric"
                  onChangeText={(e) => {
                    setUpdatedDetails({
                      ...updatedDetails,
                      price: Number(e),
                    });
                  }}
                  defaultValue={toUpdateDetails?.price?.toString()}
                ></TextInput>
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Date: </Text>

              <Text className="w-[40%] border-b text-center self-center ">
                {toUpdateDetails?.date}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",

                marginTop: 10,
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setToUpdateDetails();
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  if (prevstocks !== updatedDetails?.stocks) {
                    Alert.alert(
                      "Stocks changed",
                      "Do you want to adjust pricing base on new stocks?",
                      [
                        {
                          text: "No",
                          onPress: () => {
                            updateinventory();
                          },
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            let newCapital =
                              updatedDetails.stocks *
                              updatedDetails.priceperpiece;
                            inventoryUpdate(
                              updatedDetails?.id,
                              {
                                ...updatedDetails,
                                capital: newCapital,
                              },
                              true
                            )
                              .then(() => {
                                setToUpdateDetails();
                                customAlert("Success, Item Updated");
                                dispatch(
                                  editInventory({
                                    ...updatedDetails,
                                    capital: newCapital,
                                  })
                                );
                              })
                              .catch((err) => {
                                customAlert(`Error, ${err}`);
                              });
                          },
                        },
                      ],
                      {}
                    );
                  } else {
                    updateinventory();
                  }

                  function updateinventory() {
                    inventoryUpdate(updatedDetails?.id, updatedDetails)
                      .then(() => {
                        setToUpdateDetails();
                        customAlert("Success, Item Updated");
                        dispatch(editInventory(updatedDetails));
                      })
                      .catch((err) => {
                        customAlert(`Error,${err}`);
                      });
                  }
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// id	INTEGER,
// item	TEXT,
// capital NUMERIC,
// price	NUMERIC,
// priceperpiece NUMERIC,
// stocks  NUMERIC,
// date	TEXT,

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

    margin: "auto",
  },
  modalView: {
    height: "auto",
    minHeight: 300,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: "30%",
    marginHorizontal: 5,
  },
  buttonOpen: {
    backgroundColor: "#9494b8",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    width: "20%",
    margin: 5,
    textAlign: "center",
  },
  input: {
    height: 30,
    width: "70%",
    maxWidth: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
});

export default InventoryModal;
