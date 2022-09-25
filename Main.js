const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets",express.static("assets"));


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fcbayern1",
    database: "clinic_data"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/Patientlogin",function(req,res){
    res.sendFile(__dirname + "/PatientLogin.html");
})


app.post("/log",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from clinic_data.patient_login where username = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/Profile");
        } else {
            res.redirect("/PatientLogin");
        }
        res.end();
    })
})

// when login is success
app.get("/Profile",function(req,res){
    res.sendFile(__dirname + "/Profile.html")
})


// set app port 
app.listen(4000);