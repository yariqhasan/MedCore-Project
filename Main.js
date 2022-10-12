const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
// change to an available localhost port
// Can use Resource Monitor (Windows) to find available localports
const localHostPortNum = 1120;
const schemaName = "hospitaldb";
const dbPassword = "!3df0ry3rh34d";

const app = express();
app.use("/assets",express.static("assets"));

//establish connection to your local database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: `${dbPassword}`,
    database: `${schemaName}`,
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!");
});

//index loads up to localhost:#port
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})
app.get("/PatientLogin.html",function(req,res){
    res.sendFile(__dirname + "/PatientLogin.html");
})
app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query(`select * from ${schemaName}.login where username = ${username} and password = ${password}`, function(error,results,fields){
        if (results.length > 0 && !error) {
            res.redirect("/Profile.html");
        } else{
            res.redirect("/PatientLogin.html");
        }
        res.end();
    })
})
// when login is success
app.get("/Profile.html",function(req,res){
    res.sendFile(__dirname + "/Profile.html")
})
// set app port 
app.listen(localHostPortNum);