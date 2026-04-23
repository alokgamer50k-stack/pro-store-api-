const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DB_FILE = path.join(__dirname, 'database.json');

const loadData = () => {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const saveData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

app.get('/api/products', (req, res) => {
    try { res.json(loadData()); } 
    catch (error) { res.status(500).json({ error: "Server Error" }); }
});

app.post('/api/products', (req, res) => {
    try {
        const products = loadData();
        const newProduct = {
            id: Date.now().toString(),
            title: req.body.title,
            price: req.body.price,
            img: req.body.img,
            adsLink: req.body.adsLink,
            directLink: req.body.directLink
        };
        products.push(newProduct);
        saveData(products);
        res.status(201).json({ message: "Product Added", product: newProduct });
    } catch (error) { res.status(500).json({ error: "Failed to save product" }); }
});

app.delete('/api/products/:id', (req, res) => {
    try {
        let products = loadData();
        products = products.filter(p => p.id !== req.params.id);
        saveData(products);
        res.json({ message: "Product Deleted" });
    } catch (error) { res.status(500).json({ error: "Failed to delete" }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`));
