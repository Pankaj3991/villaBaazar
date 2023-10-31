const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path:"../../../.env"});

const username = process.env.db_username;
const password = process.env.db_password;

const Connection = ()=>{
    const urlConnect = `mongodb+srv://${username}:${password}@cluster0.9ca9gxg.mongodb.net/villaBazaar?retryWrites=true&w=majority`;
    mongoose.connect(urlConnect,{useNewUrlParser:true})

    mongoose.connection.on('connected', ()=>{
        console.log("database connected successfully");
    });
    mongoose.connection.on('disconnected',()=>{
        console.log("DataBase disconnected");
    });
    mongoose.connection.on('error',()=>{
        console.log("error occured");
    });
};

module.exports = Connection;