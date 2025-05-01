const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    amount:{
        type:Number,
        required:true
    },image:{
        path : {type:String},
        filename : {type:String}
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
IncomeSchema.virtual("formattedDate").get(function () {
    return this.date.toISOString().split("T")[0].split("-").reverse().join("-");
});

const IncomeModel = mongoose.model('income',IncomeSchema);
module.exports=IncomeModel;

