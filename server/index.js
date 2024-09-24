const express = require("express");
const cors = require("cors");
const fs = require("fs");
const products = require("./sample.json");

const app = express();
app.use(express.json());
const port = 5000;

// CORS configuration to allow requests from Netlify
app.use(cors({
  origin: ["http://localhost:5173", "https://tridot-task2.netlify.app"], // Add your Netlify domain here
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`App is running on port ${port}`);
  }
});

app.get("/products", (req, res) => {
  return res.json(products);
});

app.delete("/products/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredProducts = products.filter((product) => product.id !== id);

  fs.writeFile("./sample.json", JSON.stringify(filteredProducts), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error writing to file" });
    }
    return res.json(filteredProducts);
  });
});

app.post("/products", (req, res) => {
  let { name, price, oldPrice, category, isActive, description } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "All required fields are not provided" });
  }
  let id = Date.now();
  products.push({ id, name, price, oldPrice, category, isActive, description });

  fs.writeFile("./sample.json", JSON.stringify(products), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error writing to file" });
    }
    return res.json({ message: "Product added successfully", products });
  });
});

app.patch("/products/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, price, oldPrice, category, isActive, description } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "All required fields are not provided" });
  }
  
  let index = products.findIndex((product) => product.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = { id, name, price, oldPrice, category, isActive, description };

  fs.writeFile("./sample.json", JSON.stringify(products), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error writing to file" });
    }
    return res.json({ message: "Product updated successfully", products });
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
