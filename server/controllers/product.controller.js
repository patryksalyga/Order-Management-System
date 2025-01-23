const Product = require('../models/product.model')
const Category = require('../models/category.model')

const getProducts =  async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getProduct =  async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createProduct = async (req, res) => {
    const { name, description, price, weight, category } = req.body;

    try {
        const categoryDoc = await createOrFindCategory(category);

        const newProduct = new Product({
            name,
            description,
            price,
            weight,
            category: categoryDoc._id
        });

        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try{
        const { id } = req.params;

        if(req.body.price < 0.01 || req.body.weight <= 0){
            return res.status(500).json({message: "Invalid values"});
        }

        const product = await Product.findByIdAndUpdate(id, req.body);
        
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        const updatedProduct = await Product.findById(id);

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteProduct = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        res.status(200).json({ message: "Product deleted successfully", product: product });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createOrFindCategory = async (name) => {
    if (!name) {
        throw new Error("Category name is required");
    }

    let category = await Category.findOne({ name });
    if (!category) {
        category = new Category({ name });
        await category.save();
    }

    return category;
};

const seoDescription = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const category = await Category.findById(product.category);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.GROQ_URL
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'user',
                        content: `
                            Create an SEO-friendly product description based on the following product details:
                            - Product name: ${product.name}
                            - Product description: ${product.description}
                            - Product price: ${product.price}
                            - Product weight: ${product.weight}kg
                            - Product category: ${category.name}.
                            Dont' include keywords, notes and any promotional content.
                        `
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices.length) {
            throw new Error('Failed to generate SEO description');
        }

        const generatedDescription = data.choices[0].message.content.trim();

        const seoDescription = `
            <div class="product-description">
                <h1>${product.name}</h1>
                <p>${generatedDescription}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Weight:</strong> ${product.weight}kg</p>
                <p><strong>Category:</strong> ${category.name}</p>
            </div>
            `
        ;

        return res.status(200).send( generatedDescription );

    } catch (error) {
        console.error('Error generating SEO description:', error);
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    seoDescription
}