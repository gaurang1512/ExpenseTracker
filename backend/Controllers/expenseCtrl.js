const ExpenseModel = require("../Models/Expense");

const createExpCtrl = async (req, res) => {
    try {
        const { title, description, date, amount } = req.body;
        const userId = req.user._id; // Extract from token middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const newExpense = new ExpenseModel({ 
            title, 
            description, 
            date, 
            amount, 
            user: userId 
        });
        await newExpense.save();

        res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//fetch all 
const fetchAllExpCtrl = async (req,res) =>{
    try {
        const userId = req.user._id; // Get user ID from authenticated user
        const expenses = await ExpenseModel.find({ user: userId }).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data: expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching expenses",
            error: error.message
        });
    }
}

//fetch single
const fetchExpDetailsCtrl = async (req,res) =>{
    const {id} = req?.params;
    try {
        const expense = await ExpenseModel.findById(id);
        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching expense details",
            error: error.message
        });
    }
}

// Update expense
const updateExpCtrl = async (req, res) => {
    const { id } = req.params;
    const { title, amount, description, date } = req.body;
    try {
        const expense = await ExpenseModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                amount,
                date
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating expense",
            error: error.message
        });
    }
}

// Delete expense
const deleteExpCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await ExpenseModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            data: expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting expense",
            error: error.message
        });
    }
}

module.exports ={
    createExpCtrl,
    fetchAllExpCtrl,
    fetchExpDetailsCtrl,
    updateExpCtrl,
    deleteExpCtrl,
};
