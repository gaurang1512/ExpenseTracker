const mongoose = require("mongoose")

const mongo_url = process.env.MONGO_CON;

mongoose.connect('mongodb+srv://gaurangjalgaonkar2004:T4gmVUOhArHOyPH2@cluster0.yikss.mongodb.net/Auth-db?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        mongoose.set('strictQuery',false)
        console.log("Database Connected");
    }).catch((err)=>{
        console.log("Error :",err);
    })