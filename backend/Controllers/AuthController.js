const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../Models/user');

const signup = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
                .json({message:'User already exist you can login!!!',success:false});
        }
        const userModel = new UserModel({name,email,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201)
            .json({message:'Sign up Successfully',success:true});
    } catch (err) {
        res.status(500)
            .json({message:'Internal server error',success:false});
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});

        const errorMsg = "Authentication failed. Email or Password is wrong."
        if(!user){
            return res.status(403)
                .json({message:errorMsg,success:false});
        }
        //Password checking                    from client     from database
        const isPAssEqual = await bcrypt.compare(password,      user.password);
        //if password is wrong
        if(!isPAssEqual){
            return res.status(403)
                .json({message:errorMsg,success:false});
        }
        //if password is right
        const jwtToken = jwt.sign(
            {email:user.email,_id:user._id}, //payload 
            process.env.JWT_SECRET, 
            {expiresIn : '24h'}
        )        
        //sending jwtToken as responce
        res.status(200)
            .json({message:'Login Successfully',
                success:true,
                jwtToken,
                email,
                name : user.name,
                _id : user._id
            });
    } catch (err) {
        res.status(500)
            .json({message:'Internal server error',success:false});
            console.log("Error",err);
    }
}
module.exports = {
    signup,
    login
}
