const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction.js");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
  res.json("test ok2");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { name, description, datetime, price } = req.body;
  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price,
  });
  res.json(transaction);
});
app.get("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();

  // Set Cache-Control header to prevent caching
  res.setHeader("Cache-Control", "no-store");

  res.json(transactions);
});

app.post("/api/clear-transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);

  try {
    await Transaction.deleteMany();
    res.json({ message: "Transactions cleared successfully" });
  } catch (error) {
    console.error("Error clearing transactions:", error);
    res.status(500).json({ message: "Failed to clear transactions" });
  }
});

app.listen(4040);

//G8RXWUDGMvFnBocH
