const IncomeModel = require("../Models/Income");
const UserModel = require("../Models/user")
/*const createExpCtrl = async (req,res) =>{
    let { title, amount, description, date  , user } = req.body;
    const {_id} = req.user;
    try {
        // Ensure data is received
        if (!title || !description || !amount || !date || !user) {
            return res.status(400).json({ success: false, message: 'All fields are required!' });
        }
        //Pshing the data
        const newIncome = IncomeModel.findByIdAndUpdate(
            _id,//userId
            {
                $push :req.body
            },
            {new:true} // for returning the updated doc
        );

        // Return the saved expense
        res.status(201).json({message:'Income Added', success: true, data: newIncome });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}*/
/*
const createExpCtrl = async (req, res) => {
  try {
    const { title, description, date, amount, userId } = req.body;

    // ✅ Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Create new income with user reference
    const newIncome = new IncomeModel({
      title,
      description,
      date,
      amount,
      user: userId, // Store user's MongoDB ID
    });

    await newIncome.save();
    res.status(201).json({ success: true, message: "Income added successfully", income: newIncome });

  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
*/

    const createExpCtrl = async (req, res) => {
    try {
      const { title, description, date, amount } = req.body;
      const userId = req.user._id; // Extract from token middleware
  
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
  
      const newIncome = new IncomeModel({ title, description, date, amount, user: userId });
      await newIncome.save();
  
      res.status(201).json({ success: true, data: newIncome });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
}
  

//fetch all 

const fetchAllIncCtrl = async (req,res) =>{
    try {
        const userId = req.user._id; // Get user ID from authenticated user
        const incomes = await IncomeModel.find({ user: userId }).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            message: "Incomes fetched successfully",
            data: incomes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incomes",
            error: error.message
        });
    }
}
/*
const fetchAllIncCtrl=async (req,res)=>{
    const body = req.body;
    const {_id} = req.user;
    try {
        const userData = await UserModel.findById(_id);
        return res.status(200).json({
            message:"Fetch Expence Successfully!!!",
            success:true,
            data:userData?.expenses
        })
    } catch (err) {
        return res.status(500).json({
            message:"Something went wrong",
            error:err,
            success:false
        })
    }
}*/
//fetch all income by id of user
/*
const fetchAllIncCtrl = async (req, res) => {
    try {
        const { userId } = req.body; // Get userId from query params
         
        // Validate userId
        if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
        }else{
            console.log('id found in IncomeCtrl');
        }
    
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID" });
        }
    
        // Find all income records for the user
        const incomes = await IncomeModel.find({ user: userId });
    
        res.status(200).json(incomes);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };
*/


//fetch single
const fetchIncDetailsCtrl = async (req,res) =>{
    const {id} = req?.params;
    try {
        const income = await IncomeModel.findById(id);
        res.json(income);
    } catch (error) {
        res.json(error)
    }
    
}
/*const fetchIncDetailsCtrl = async (req,res)=>{
    const body = req.body;
    const {_id} = req.user;
    try{
        const income = await IncomeModel.findById(_id);
        Select('income');
        return res.status(200).json({
            message:"USer data",
            success:true,
            data:income?.IncomeModel
        })
    }catch(err){
        return res.status(500).json({
            message:"Something went wrong",
            error:err,
            success:false
        })
    }
}*/
//Update
const updateIncCtrl = async(req,res)=>{
    const {id} = req?.params;
    const {title, amount, description, date} = req.body;
    try {
        const income = await IncomeModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                amount,
                date,
                image
            },
            {new: true}
        );
        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            data: income
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating income",
            error: error.message
        });
    }
}

const deleteIncCtrl = async (req,res) =>{
    const {id} = req?.params;
    try {
        const income = await IncomeModel.findByIdAndDelete(id);
        res.json(income);
    } catch (error) {
        res.json(error)
    }
    
}
module.exports ={
    createExpCtrl,
    fetchAllIncCtrl,
    fetchIncDetailsCtrl,
    updateIncCtrl,
    deleteIncCtrl,
};
