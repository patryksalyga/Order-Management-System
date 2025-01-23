const Product = require('../models/product.model.js');
const Category = require('../models/category.model');

const fileInit = async (req, res) => {
    const { products } = req.body;

    try {
        for (const item of products) {
            // Sprawdzamy, czy produkt istnieje
            const product = await Product.findOne({ name: item.name });
            if (product) {
                return res.status(409).json({ "message": `Product "${item.name}" already exists` });
            }

            // Sprawdzamy, czy kategoria istnieje
            const category = await Category.findOne({ name: item.category });
            if (!category) {
                return res.status(409).json({ "message": `Category "${item.category}" does not exist` });
            }
        }

        for (const item of products) {
            // Pobieramy kategorię
            const category = await Category.findOne({ name: item.category });

            // Tworzymy nowy produkt
            const newProduct = new Product({
                name: item.name,
                description: item.description,
                price: item.price,
                weight: item.weight,
                category: category._id // Przypisujemy `_id` kategorii
            });

            await newProduct.save();
        }

        res.status(201).json({ message: "Products added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    fileInit 
}
