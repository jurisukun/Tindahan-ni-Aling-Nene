import * as SQLite from "expo-sqlite";

// Open or create the database
const db = SQLite.openDatabase("app.db");

export const deleteDatabase = (tablename) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tablename};`,
        [],

        (_, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to delete database"));
          }
        }
      );
    });
  });
};

// Create a table (if it doesn't exist)
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE transactions (
	id	INTEGER,
	item	TEXT,
	price	NUMERIC,
  priceperpiece NUMERIC,
  quantity  NUMERIC,
	date	TEXT,
	PRIMARY KEY(id AUTOINCREMENT)
)`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE inventory (
	id	INTEGER,
	item	TEXT,
  capital NUMERIC,
	price	NUMERIC,
  priceperpiece NUMERIC,
  stocks  NUMERIC,
	date	TEXT,
	PRIMARY KEY(id AUTOINCREMENT)
)`
    );
  });
};

export const updateDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT totalstocks FROM inventory;`,
        [],

        (_, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to update database"));
          }
        }
      );
    });
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `ALTER TABLE inventory ADD COLUMN totalstocks NUMERIC;`,
    //     [],

    //     (_, result) => {
    //       if (result) {
    //         resolve(result);
    //       } else {
    //         reject(new Error("Failed to update database"));
    //       }
    //     }
    //   );
    // });
  });
};

// Add a record to the table
export const addRecord = (item, price, date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO transactions (item, price, quantity, date) VALUES (?, ?, ?,?);`,
        [item, price, quantity, date],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            resolve(insertId);
          } else {
            reject(new Error("Failed to add record"));
          }
        }
      );
    });
  });
};

export const addInventoryRecord = (item, capital, price, stocks, date) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO inventory (item,capital, price, stocks, date) VALUES (?, ?, ?,?,?);`,
        [item, capital, price, stocks, date],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            resolve(insertId);
          } else {
            reject(new Error("Failed to add record"));
          }
        }
      );
    });
  });
};

export const addMultipleTransactions = (records, inventory, fromImport) => {
  const insertsql = async (
    item,
    price,
    priceperpiece,
    quantity,
    date,
    resolve,
    reject
  ) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO transactions (item, price,priceperpiece, quantity, date) VALUES (?,?,?,?,?);",
        [item, Number(price), Number(priceperpiece), Number(quantity), date],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) {
            resolve(insertId);
          } else {
            reject("Failed to add record");
          }
        }
      );
    });
  };

  let insertarr = [];

  let updatefunc = (entry) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          ` UPDATE inventory SET stocks = ? WHERE id=?; `,
          [entry.stocks, entry.id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve(rowsAffected);
            } else {
              reject("Failed to update record");
            }
          }
        );
      });
    });
  };

  for (const record of records) {
    let { item, price, priceperpiece, quantity, date } = record;

    insertarr.push(
      new Promise((resolve, reject) => {
        if (!fromImport) {
          let currentstock = inventory.find((inventoryitem) => {
            if (inventoryitem.item === item) return inventoryitem;
          });

          if (
            isNaN(currentstock.stocks) ||
            currentstock.stocks < quantity ||
            currentstock.stocks <= 0
          ) {
            reject("Insufficient stocks");
            return;
          }

          db.transaction((tx) => {
            tx.executeSql(
              `SELECT * FROM inventory WHERE LOWER(item)=? AND priceperpiece=? AND price=? AND stocks > 0; `,
              [item.toLowerCase(), Number(priceperpiece), Number(price)],
              async (_, { rows }) => {
                if (rows.length > 0) {
                  let remainingquantity = Number(quantity);

                  for (const entry of rows._array) {
                    if (remainingquantity <= 0) break;
                    if (entry.stocks >= remainingquantity) {
                      entry.stocks -= remainingquantity;
                      await updatefunc(entry);
                      remainingquantity = 0;

                      break;
                    } else if (entry.stocks < Number(quantity)) {
                      remainingquantity -= Number(entry.stocks);
                      entry.stocks = 0;
                      await updatefunc(entry);
                    }
                  }

                  insertsql(
                    item,
                    price,
                    priceperpiece,
                    quantity,
                    date,
                    resolve,
                    reject
                  );

                  // db.transaction((tx) => {
                  //   tx.executeSql(
                  //     ` UPDATE inventory SET stocks = ? WHERE item=? AND stocks > ${Number(
                  //       quantity
                  //     )}; `,
                  //     [currentstock.stocks - Number(quantity), item],

                  //     (_, { rowsAffected }) => {
                  //       if (rowsAffected > 0) {
                  //         insertsql(
                  //           item,
                  //           price,
                  //           priceperpiece,
                  //           quantity,
                  //           date,
                  //           resolve,
                  //           reject
                  //         );
                  //       } else {
                  //         reject(new Error("Failed to add record"));
                  //       }
                  //     }
                  //   );
                  // });
                } else {
                  reject(new Error("Failed to add record"));
                }
              }
            );
          });
        } else {
          insertsql(
            item,
            price,
            priceperpiece,
            quantity,
            date,
            resolve,
            reject
          );
        }
      })
    );
  }

  return Promise.all(insertarr);
};

export const addMultipleInventory = (records) => {
  let insertarr = [];
  for (const record of records) {
    let { item, capital, price, date, priceperpiece, stocks } = record;
    for (const [key, value] of Object.entries(record)) {
      if (!value && key !== "id") {
        return Promise.reject("All fields must be filled");
      }
      if (
        (key === "price" || key === "capital" || key === "stocks") &&
        Number(value) <= 0
      ) {
        return Promise.reject(
          "Price, capital and quantity must be a valid number"
        );
      }
    }

    let promiseperrecord = new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM inventory WHERE LOWER(item)=? AND priceperpiece=? AND price=? AND date=?;",
          [item.toLowerCase(), Number(priceperpiece), Number(price), date],
          (_, { rows }) => {
            if (rows.length > 0) {
              db.transaction((tx) => {
                tx.executeSql(
                  "UPDATE inventory SET stocks = ?, capital=?, totalstocks=?, date=? WHERE id=?;",
                  [
                    Number(stocks) + Number(rows._array[0].stocks),
                    Number(capital) + Number(rows._array[0].capital),
                    Number(stocks) + Number(rows._array[0].totalstocks),
                    date,
                    rows._array[0].id,
                  ],

                  (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                      resolve(rowsAffected);
                    } else {
                      reject("Failed to update record");
                    }
                  }
                );
              });
            } else {
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO inventory (item, capital, price, priceperpiece, stocks,totalstocks, date) VALUES (?,?,?,?,?,?,?);",
                  [
                    item,
                    Number(capital),
                    Number(price),
                    Number(priceperpiece),
                    Number(stocks),
                    Number(stocks),
                    date,
                  ],
                  (_, { rowsAffected, insertId }) => {
                    if (rowsAffected > 0) {
                      resolve(insertId);
                    } else {
                      reject("Failed to add record");
                    }
                  }
                );
              });
            }
          }
        );
      });
    });
    insertarr.push(promiseperrecord);
  }

  return Promise.all(insertarr);
};

export const selectall = (tablename) => {
  let sql = "";
  if (tablename === "inventory") {
    sql =
      "SELECT *, SUM(stocks) AS stocks,SUM (capital) AS capital FROM inventory GROUP BY item,price,priceperpiece;";
  } else {
    sql = `SELECT * FROM ${tablename};`;
  }
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql, [], (_, { rows }) => {
        if (rows.length > 0) {
          resolve(rows);
        } else if (rows.length == 0) {
          resolve({ _array: [] });
        } else {
          reject("Failed to get transactions");
        }
      });
    });
  });
};

export const inventoryUpdate = (itemId, newdetails, updatepricing) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM inventory WHERE id=?;",
        [Number(itemId)],

        (_, { rows }) => {
          if (rows.length > 0) {
            let olddata = rows._array[0];
            let sql = "";
            let params = [];
            if (updatepricing) {
              sql =
                "UPDATE inventory SET item =?, capital =?, price =?, priceperpiece=?, stocks=?,totalstocks=?,date=? WHERE id=?;";
              params = [
                newdetails.item,
                newdetails.capital,
                newdetails.price,
                newdetails.priceperpiece,
                newdetails.stocks,
                olddata.totalstocks - (olddata.stocks - newdetails.stocks),
                newdetails.date,
                Number(itemId),
              ];
            } else {
              sql =
                "UPDATE inventory SET item =?, capital =?, priceperpiece=?, stocks=?,date=? WHERE id=?;";
              params = [
                newdetails.item,
                newdetails.capital,
                newdetails.priceperpiece,
                newdetails.stocks,
                newdetails.date,
                Number(itemId),
              ];
            }

            db.transaction((tx) => {
              tx.executeSql(
                sql,
                params,

                (_, { rowsAffected }) => {
                  if (rowsAffected > 0) {
                    resolve(rowsAffected);
                  } else {
                    reject("Failed to update record");
                  }
                }
              );
            });
          } else {
            reject("Data not found");
          }
        }
      );
    });
  });
};

export const deleteRecord = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM transactions WHERE id = ?;",
        [id],

        (_, { rowsAffected }) => {
          if (rowsAffected) {
            resolve(rowsAffected);
          } else {
            reject("Failed to delete record");
          }
        }
      );
    });
  });
};

export const deleteAllRecord = (tablename) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tablename};`,
        [],

        (_, results) => {
          if (results) {
            resolve(results);
          } else {
            reject("Failed to delete record");
          }
        }
      );
    });
  });
};

export const getTotalTransactionsGroupByDate = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT date, SUM(price*quantity) AS total_transaction,  SUM(priceperpiece*quantity) AS total_capital FROM transactions GROUP BY date ORDER BY date DESC;",
        [],

        (_, { rows }) => {
          if (rows) {
            resolve(rows);
          } else {
            reject("Failed to get total");
          }
        }
      );
    });
  });
};

export const getotalCapitalByDate = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT date, SUM(totalstocks*priceperpiece) AS total_capital FROM inventory GROUP BY date ORDER BY date DESC;",
        [],

        (_, { rows }) => {
          if (rows) {
            resolve(rows);
          } else {
            reject("Failed to get total");
          }
        }
      );
    });
  });
};

export const getTotals = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT SUM(price) as total FROM transactions;",
        [],

        (_, { rows }) => {
          if (rows) {
            resolve(rows);
          } else {
            reject("Failed to get total");
          }
        }
      );
    });
  });
};

export const editRecord = (id, newitem, newprice, newdate) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE transactions SET item=?, price=?,date=? WHERE id=?;",
        [newitem, newprice, newdate, id],

        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve(rowsAffected);
          } else {
            reject("Failed to update record");
          }
        }
      );
    });
  });
};
