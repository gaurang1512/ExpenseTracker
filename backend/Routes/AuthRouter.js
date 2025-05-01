const router = require('express').Router();
const express = require('express');



const { singupValidation, loginValidation} = require('../Middleware/AuthValidation');
const {signup, login } = require('../Controllers/AuthController');

router.post('/signup',singupValidation,signup);

router.post('/login',loginValidation,login);
module.exports=router;


//This code was used for checking signup and login taking correct input and working correctly before validation and datbase connection.
/*
router.post('/login',(req,res) =>{
    res.send('login sucess');
});

router.post('/signup',(req,res) =>{
    res.send('signup sucess');
});
*/