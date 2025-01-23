const Category = require('../models/category.model');

const createCategory = async (req, res) => {
    const { name } = req.body;

    // Walidacja wejścia
    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ 
            message: "Category added successfully", 
            category: newCategory 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getCategories = async (req, res) => {
    try{
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createCategory,
    getCategories
}