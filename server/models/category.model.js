const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a category name"],
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
