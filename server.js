const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Badi image files ke liye limit badha di hai

const DB_FILE = path.join(__dirname, 'database.json');

// Agar database file nahi hai, toh nayi banao
const loadData = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const saveData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Website ko products dikhane ke liye
app.get('/api/products', (req, res) => {
    try {
        res.json(loadData());
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Naya product add karne ke liye
app.post('/api/products', (req, res) => {
    try {
        const products = loadData();
        const newProduct = {
            id: Date.now().toString(),
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            link: req.body.link
        };
        products.push(newProduct);
        saveData(products);
        res.status(201).json({ message: "Product Added", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Failed to save product" });
    }
});

// Product delete karne ke liye
app.delete('/api/products/:id', (req, res) => {
    try {
        let products = loadData();
        products = products.filter(p => p.id !== req.params.id);
        saveData(products);
        res.json({ message: "Product Deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
          
