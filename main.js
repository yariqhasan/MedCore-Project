const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
// change to an available localhost port
// Can use Resource Monitor (Windows) to find available localports
const localHostPortNum = 1120;
const schemaName = "clinic_data";
const dbPassword = "Dy3rmak3r";

const app = express();
app.use("/assets",express.static("assets"));

// set app port 
app.listen(localHostPortNum);
//establish connection to your local database
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "admin",
    password: `${dbPassword}`,
    database: `${schemaName}`,
    port: 3306,
});

//connect to the database
connect() = connection.connect(function(error){
    if (!error) console.log(`Connected to the ${schemaName} successfully!`)
    else {
        console.log(error)
        connection.connect()
    }
});

//#region Queries
app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query(`select * from ${schemaName}.login where username = ${username} and password = ${password}`, function(error,results,fields){
        if (results.length > 0 && !error) {
            // when login is success
            res.redirect("/profile.html");
            console.log(`Successfull Login \n Results: ${results}`)
        } else{
            // login fails
            res.redirect("/patient_login.html");
            console.log(`Failed Login \n Results: ${results}`)
        }
        res.end();
    })
})
app.post("/", encoder, function(req, res){
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if(!email | !username | !password | !confirmPassword){
        res.redirect(`/register_account.html`)
    }

    if(password != confirmPassword) {
        throw error;
    }
    console.log(`made it here`)
    connection.query(`INSERT INTO ${schemaName}.login (username, password, email) VALUES ("${username}", "${password}", "${email}")`, function(error, results, fields){
        console.log(results);
        if(!error) console.log(`User ${username} created successfully`)
        else console.log(error)
    })

})
//#endregion Queries


//#region Routes 
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})
app.get("/index.html",function(req,res){
    res.sendFile(__dirname + "/index.html");
})
app.get("/patient_login.html",function(req,res){
    res.sendFile(__dirname + "/patient_login.html");
})
app.get("/admin_login.html",function(req,res){
    res.sendFile(__dirname + "/admin_login.html");
})
app.get("/profile.html",function(req,res){
    res.sendFile(__dirname + "/profile.html")
})
app.get("/register_account.html",function(req,res){
    res.sendFile(__dirname + "/register_account.html")
})
app.get("/patient_management.html",function(req,res){
    res.sendFile(__dirname + "/patient_management.html")
})
app.get("/patient_list.html",function(req,res){
    res.sendFile(__dirname + "/patient_list.html")
})
//#endregion Routes
