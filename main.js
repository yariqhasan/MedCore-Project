const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use(express.static('assets'))
app.use('/css',express.static(__dirname+ 'assets/css'));
app.use('/js',express.static(__dirname+ 'assets/js'));
app.use('/img',express.static(__dirname+ 'assets/img'));
app.use('/vendor',express.static(__dirname+ 'assets/vender'));


//set views
app.set('views', './views');
app.set('view engine', 'ejs');


// change to an available localhost port
// Can use Resource Monitor (Windows) to find available localports
const localHostPortNum = 1120;
const schemaName = "clinic_data";
const dbPassword = "Dy3rmak3r";

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

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("",(req,res) => {
    res.render('index');
});




app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    const loginQuery = `select * from ${schemaName}.login where username = "${username}" and password = "${password}"`
    const employeeLoginQuery = `select * from ${schemaName}.login where username = "${username}" and password = "${password}"`
    connection.query(loginQuery, function(error,results,fields){
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

//New Patient Entry Form

app.post("/new_entry",encoder, function(req,res){
    var PID = req.body.PID;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var contact_num = req.body.contact_num;
    var address = req.body.address_num;
    var email_addr = req.body.email_addr;
    var sex = req.body.sex;
    
    var sql = 'insert into clinic_data.patient (PID, first_name, last_name, contact_num, address, email_addr,sex) Values ?';
    var values = [[PID,first_name,last_name,contact_num,address,email_addr,sex]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/Patient_entry");
   });

});
app.post("/", encoder, function(req, res){
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    const createAccountQuery = `INSERT INTO ${schemaName}.login (username, password, email) VALUES ("${username}", "${password}", "${email}")`
    if(!email | !username | !password | !confirmPassword){
        res.redirect(`/register_account.html`)
    }

    if(password != confirmPassword) {
        console.log(error)
        res.redirect(`/register_account.html`)
    }
    connection.query(createAccountQuery, function(error, results, fields){
        if(!error) {
            console.log(`User ${username} created successfully`)
            res.redirect(`/patient_login.html`)
        }
        else 
        {
            console.log(error)
            res.redirect(`/register_account.html`)
        }
    })

})

//Fetch data from SQL to Table

app.get("/PatientList", (req, res) =>{
    connection.query('SELECT * FROM clinic_data.patient ',(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("PatientList",{
             patient : rows
         });
    })
 });

// when login is success
app.get("/admin_login",(req,res) => {
    res.render('admin_login');
});

app.get("/PatientLogin",(req,res) => {
    res.render('PatientLogin');
});

app.get("/Chat_bots",(req,res) => {
    res.render('Chat_bots');
});
app.get("/index",(req,res) => {
    res.render('index');
});
app.get("/PatientList",(req,res) => {
    res.render('PatientList');
});
app.get("/Check_out",(req,res) => {
    res.render('Check_out');
});
app.get("/Payment",(req,res) => {
    res.render('Payment');
});
app.get("/Profile",(req,res) => {
    res.render('Profile');
});
app.get("/Patient_entry",(req,res) => {
    res.render('Patient_entry');
});
app.get("/Appointment",(req,res) => {
    res.render('Appointment');
});
app.get("/PaymentApproved",(req,res) => {
    res.render('PaymentApproved');
});
app.get("/RegisterAccount.html",function(req,res){
    res.sendFile(__dirname + "RegisterAccount")
})