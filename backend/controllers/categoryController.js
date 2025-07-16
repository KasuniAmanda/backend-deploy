// controllers/categoryController.js

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory'); 

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category items' });
    }
};

// Add a new category
const addCategory = async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const newCategory = new Category({ categoryName });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: 'Error adding item' });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Optionally delete associated subcategories
        await Subcategory.deleteMany({ categoryId: id });

        res.json({ message: 'Category and associated subcategories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};

//  Update a category and its subcategories
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, subcategories } = req.body;

    console.log(' Received update data:', req.body);

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        // 1. Update category name
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categoryName },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // 2. Fetch all existing subcategories for this category from DB
        const existingSubs = await Subcategory.find({ categoryId: id });
        const existingSubIds = existingSubs.map(sub => sub._id.toString());

        // 3. Get list of subcategory IDs from incoming request
        const incomingSubIds = (subcategories || [])
            .filter(sub => sub._id)
            .map(sub => sub._id);

        // 4. Identify subcategories to delete (present in DB but missing from update payload)
        const toDeleteIds = existingSubIds.filter(existingId => !incomingSubIds.includes(existingId));

        if (toDeleteIds.length > 0) {
            await Subcategory.deleteMany({ _id: { $in: toDeleteIds } });
        }

        // 5. Update existing subcategories and add new ones if any
        if (Array.isArray(subcategories)) {
            for (const sub of subcategories) {
                if (sub._id && sub.subcategoryName) {
                    // Update existing subcategory
                    await Subcategory.findByIdAndUpdate(
                        sub._id,
                        { subcategoryName: sub.subcategoryName },
                        { new: true, runValidators: true }
                    );
                } else if (sub.subcategoryName && !sub._id) {
                    // Add new subcategory (no _id yet)
                    const newSub = new Subcategory({
                        subcategoryName: sub.subcategoryName,
                        categoryId: id
                    });
                    await newSub.save();
                }
            }
        }

        res.json({ message: 'Category and subcategories updated successfully' });
    } catch (error) {
        console.error("Error updating category and subcategories:", error);
        res.status(500).json({ error: 'Error updating category and subcategories' });
    }
};


module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory
};
