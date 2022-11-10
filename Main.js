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

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Fcbayern1",
    database: "clinic_database"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("",(req,res) => {
    res.render('index');
});




//Login in 
app.post("/log",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from clinic_database.patient_login where username = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/Profile");
        } else {
            res.redirect("/PatientLogin");
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
    var address = req.body.address;
    var email_addr = req.body.email_addr;
    var sex = req.body.sex;
    
    var sql = 'insert into clinic_database.patient (PID, first_name, last_name, contact_num, address, email_addr,sex) Values ?';
    var values = [[PID,first_name,last_name,contact_num,address,email_addr,sex]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/Patient_entry");
   });

});

// insert data to the appointment table

app.post("/appointment",encoder, function(req,res){
    var PID = req.body.PID;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var contact_num = req.body.contact_num;
    var address = req.body.address;
    var email_addr = req.body.email_addr;
    var sex = req.body.sex;
    
    var sql = 'insert into clinic_database.patient (PID, first_name, last_name, contact_num, address, email_addr,sex) Values ?';
    var values = [[PID,first_name,last_name,contact_num,address,email_addr,sex]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/Patient_entry");
   });

});

//Fetch data from SQL to HTML Table

app.get("/PatientList", (req, res) =>{
    connection.query('SELECT * FROM clinic_database.patient ',(err, rows) => {
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
app.get("/Appoint_manage",(req,res) => {
    res.render('Appoint_manage');
});
app.get("/PaymentApproved",(req,res) => {
    res.render('PaymentApproved');
});
app.get("/Patient_appoint",(req,res) => {
    res.render('Patient_appoint');
});

app.get("/doctor_billing",(req,res) => {
    res.render('doctor_billing');
});
app.get("/CRUD_Edit_admin_appoint",(req,res) => {
    res.render('CRUD_Edit_admin_appoint');
});




// set app port 
app.listen(8000);