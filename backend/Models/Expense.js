const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    amount:{
        type:Number,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, //Must be mongoDB ID
        ref:'UserModel',
        required:true
    }
},{
    timestamps:true,
}
);

ExpenseSchema.virtual("formattedDate").get(function () {
    return this.date.toISOString().split("T")[0].split("-").reverse().join("-");
});

const ExpenseModel = mongoose.model('expense',ExpenseSchema);
module.exports=ExpenseModel;
