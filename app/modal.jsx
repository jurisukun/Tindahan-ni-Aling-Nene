import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useState, useRef } from "react";
import { connect } from "react-redux";

import { editRecord } from "../config/sqlite";
import { updateItem } from "../redux/actions/transactionActions";
import { customAlert } from "./addEntry";
const mapStateToProps = (state) => {
  return {
    records: state.transactions,
  };
};

function Popup({
  updateItem,
  id,
  item,
  price,
  date,
  isVisible,
  setIsVisible,
  setSelecteditem,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const itemRef = useRef(item);
  const priceRef = useRef(price);
  const dateRef = useRef(date);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!isVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Item: </Text>
              <TextInput
                onChangeText={(e) => {
                  itemRef.current = e;
                }}
                style={styles.input}
                defaultValue={itemRef.current}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Price: </Text>
              <TextInput
                onChangeText={(e) => {
                  priceRef.current = e;
                }}
                style={styles.input}
                keyboardType="numeric"
                defaultValue={price > 0 ? price.toString() : ""}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: 5 }}>
              <Text style={styles.modalText}>Date: </Text>
              <TextInput
                onChangeText={(e) => {
                  dateRef.current = e;
                }}
                style={styles.input}
                defaultValue={date}
              ></TextInput>
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
                  setIsVisible(!isVisible);
                  setSelecteditem();
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  editRecord(
                    id,
                    itemRef.current,
                    priceRef.current,
                    dateRef.current
                  )
                    .then((res) => {
                      updateItem({
                        id,
                        item: itemRef.current,
                        price: priceRef.current,
                        date: dateRef.current,
                      });
                      ToastAndroid.showWithGravityAndOffset(
                        "Updated Successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                      );
                      setIsVisible(!isVisible);
                      setSelecteditem();
                    })
                    .catch((err) => {
                      customAlert(`Error, ${err}`);
                    });
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    height: "auto",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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

export default connect(mapStateToProps, { updateItem })(Popup);
