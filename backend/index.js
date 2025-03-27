require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}
connectDB();

// API Route to insert data
app.post("/addItem", async (req, res) => {
  try {
    const { itemName, category, quantity, dateOfPurchase, dateOfExpiration } = req.body;

    // Validate required fields
    if (!itemName || !category || !quantity || !dateOfPurchase || !dateOfExpiration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const database = client.db("inventoryDB");
    const collection = database.collection("items");

    const newItem = { itemName, category, quantity, dateOfPurchase, dateOfExpiration, createdAt: new Date() };
    await collection.insertOne(newItem);

    res.status(201).json({ message: "Item inserted successfully!" });
  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Route to fetch all items
app.get("/getItems", async (req, res) => {
  try {
    const database = client.db("inventoryDB");
    const collection = database.collection("items");
    const items = await collection.find({}).toArray(); // Fetch all items from DB

    res.status(200).json(items); // Send the list of items as the response
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getExpiringItems", async (req, res) => {
  try {
    const database = client.db("inventoryDB");
    const collection = database.collection("items");
    const items = await getExpiringItems(); // Fetch all items from DB

    res.status(200).json(items); // Send the list of items as the response
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Route to update an item
app.put("/updateItem/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const updateData = { ...req.body };
    delete updateData._id; // Prevent modifying _id

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    const database = client.db("inventoryDB");
    const collection = database.collection("items");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item updated successfully!" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/deleteItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db("inventoryDB");
    const collection = database.collection("items");

    await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


async function getExpiringItems() {
  const database = client.db("inventoryDB");
  const collection = database.collection("items");

  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);
  const expiringItems = await collection.find({}).toArray();

  const filteredExpiringItems = [];
  const seenItemNames = new Set(); // Used to track unique item names

  for (const item of expiringItems) {
    const expirationDate = new Date(item.dateOfExpiration);
    
    if (expirationDate > today && expirationDate <= twoDaysLater && !seenItemNames.has(item.itemName)|| expirationDate<today) {
      filteredExpiringItems.push(item);
      seenItemNames.add(item.itemName); // Mark this item as seen
    }
  }

  console.log(filteredExpiringItems);
  return filteredExpiringItems;
}

const axios = require("axios");


app.post("/getRecipe", async (req, res) => {
  try {
   
    const expiringItems = await getExpiringItems();
    
    if(expiringItems==null || expiringItems=="")
    {
      res.status(200).json({ });
    }
    
    const itemsList = expiringItems.map(item => `${item.itemName}`).join("\n");
    const prompt = `I have the following items expiring soon:\n${itemsList}\nCan you suggest 1 recipe for these items in just 200 words?`;

    
    const ollamaResponse = await axios({
      method: "post",
      url: "http://127.0.0.1:11434/api/generate",
      data: {
        model: "tinyllama",
        prompt: prompt,
        stream: false, 
      },
    });

    
    res.status(200).json({ recipe: ollamaResponse.data.response });

  } catch (error) {
    console.error("Error fetching recipe from Ollama:", error);
    res.status(500).json({ error: "Failed to get the recipe from Ollama." });
  }
});


app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
