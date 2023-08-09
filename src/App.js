import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import { response } from "express";
/* import { json, response } from "express"; */

function App() {
  const [name, setName] = useState("");
  const [datetime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setName("");
        setDateTime("");
        setDescription("");
        console.log("result", json);

        // Show success toast notification
        toast.success("Transaction Successfully Added!");

        // Fetch updated transactions after adding a new one
        getTransactions().then(setTransactions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  async function clearAllTransactions() {
    const url = process.env.REACT_APP_API_URL + "/clear-transactions";

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        // Clear transactions in state
        setTransactions([]);
        // Show success toast notification
        toast.success("Transactions Cleared!");
      } else {
        throw new Error("Failed to clear transactions");
      }
    } catch (error) {
      console.error("Error clearing transactions:", error);
      // Show error toast notification
      toast.error("Failed to clear transactions");
    }
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <h1>
        ₹{balance}
        <span>.00</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"+5000 new microphone"}
          />
          <input
            value={datetime}
            onChange={(e) => setDateTime(e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add New Transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, pos) => (
            <div className="transaction" key={pos}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description} !</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
      <button onClick={clearAllTransactions}>Clear Transactions</button>
      <ToastContainer />
    </main>
  );
}

export default App;
