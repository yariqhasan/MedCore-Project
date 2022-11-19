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




//patient Login in 
app.post("/log",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from clinic_database.patient_login where username = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/Profile");
        } else {
          app.get("/PatientLoginInvalid",(req,res) => {
            res.render('PatientLoginInvalid');
          
        });
        res.redirect("/PatientLoginInvalid");

        }
        res.end();
    })
});



// Fetch data from admin table.
app.post("/admin_log",encoder, function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    connection.query("select * from clinic_database.admin where email = ? and password = ?",[email,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/Patient_entry");
        } else {
          app.get("/AdminLoginInvalid",(req,res) => {
            res.render('admin_loginInvalid');
          
        });
        res.redirect("/AdminLoginInvalid");
        }
        res.end();
    })
});


//Fetch data from Patient table

app.get("/PatientList", (req, res) =>{
    connection.query('SELECT * FROM clinic_database.patient ',(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("PatientList",{
             patient : rows
         });
    })
 });
// Fetch data from appointment table
 app.get("/Appoint_manage", (req, res) =>{
    connection.query('SELECT * FROM clinic_database.appointment ',(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("Appoint_manage",{
             appointment : rows
         });
    })
 });

 app.get("/Patient_appointment", (req, res) =>{
    
    connection.query('SELECT `appointment`.`patient_first_name`,`appointment`.`patient_last_name`,`appointment`.`contact_num`,`appointment`.`appointment_date`,`appointment`.`service_name`,`appointment`.`doc_last_name`FROM `clinic_database`.`appointment` WHERE patient_first_name="Yariq"',(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("Patient_appointment",{
             myappoint : rows
         });
    })
 });

 app.get("/Profile", (req, res) =>{
    const confirmation_code= req.params.confirm_code;
    
    connection.query('SELECT Name,price,quantity FROM clinic_database.medicine',(err, rows) => {
        if (err) throw err;
         console.log(rows);
         res.render("Profile",{
            medications : rows
         });
    })
 });




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
// Patient register
app.post("/register", encoder, function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    const createAccountQuery = `INSERT INTO clinic_database.patient_login (username, password) VALUES ("${username}", "${password}")`
    if(!username | !password | !confirmPassword){
        res.redirect(`/RegisterAccount`)
    }

    if(password != confirmPassword) {
        console.log(error)
        res.redirect(`/RegisterLogin`)
    }
    connection.query(createAccountQuery, function(error, results, fields){
        if(!error) {
            console.log(`User ${username} created successfully`)
            res.redirect(`/PatientLogin`)
        }
        else 
        {

            console.log(error)
            res.redirect(`/RegisterAccount`)
        }
    })

});

// insert data to the appointment table

app.post("/appointment",encoder, function(req,res){
    var patient_first_name = req.body.patient_first_name;
    var patient_last_name = req.body.patient_last_name
    var contact_num = req.body.contact_num;
    var appointment_date = req.body.appointment_date;
    var service_name = req.body.service_name;
    var doctor = req.body.doctor;
    let appoint_ID= Math.floor(Math.random() * 100) + 1;


    
    var sql = 'insert into clinic_database.appointment (appoint_num, patient_first_name, patient_last_name, contact_num, appointment_date, service_name,doc_last_name) Values ?';
    var values = [[appoint_ID,patient_first_name,patient_last_name,contact_num,appointment_date,service_name,doctor]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/index");
   });

});
// INSERT INTO Billing Table.
app.post("/Processpayment",encoder, function(req,res){
    var patient_name =req.body.patient_name;
    var address =req.body.address;
    var city =req.body.city;
    var state =req.body.state;
    var zip =req.body.zip;
    var patient_email =req.body.email;
    var cardname = req.body.cardname;
    var cardnumber =req.body.cardnumber;
    var expmonth =req.body.expmonth;
    var expyear =req.body.expyear;
    var cvv =req.body.cvv;
    var amount =req.body.amount;
    var patient_email =req.body.patient_email;
    var date = req.body.date
    let confirmCode = (Math.random() + 1).toString(36).substring(7).toUpperCase();



    
    var sql = 'INSERT INTO clinic_database.processed_payment (confirm_code, amount, billing_name, patient_name, card_name, cardnumber, exp_year, exp_month, cvv, address, city, state, zip, date, billing_email, patient_email) VALUES ?';
        var values = [[confirmCode,amount,patient_name,patient_name,cardname,cardnumber,expyear,expmonth,cvv,address,city,state,zip, date, patient_email,patient_email]];
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/confirmation");
   });

});





 // edit appointment table

 app.post("/appointment_edit",encoder, function(req,res){
    const appoint_id= req.body.appoint_num;
    var sql = 'update clinic_database.appointment SET appoint_num="'+req.body.appoint_num+'", patient_first_name="'+req.body.patient_first_name+'", patient_last_name="'+req.body.patient_last_name+'", contact_num="'+req.body.contact_num+'", appointment_date="'+req.body.appointment_date+'", service_name="'+req.body.service_name+'", doc_last_name="'+req.body.doc_last_name+'" where appoint_num='+appoint_id;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/Appoint_manage");
   });
});

app.get("/edit1/:appoint_id",(req, res) => {
    const appoint_id = req.params.appoint_id;
    connection.query(`SELECT * FROM clinic_database.appointment where appoint_num = ${appoint_id}`,(err, result) => {
        if (err) throw err;
        console.log(result);
        res.render("CRUD_Edit_admin_appoint",{
            appointment : result[0]
        });
    });
});



// DELETE ROWS FORM TABLE

app.get('/delete1/:appoint_id',(req, res) =>{
    const appoint_id = req.params.appoint_id;
    let sql = `DELETE FROM clinic_database.appointment WHERE appoint_num = ${appoint_id}`;
    let query = connection.query(sql, (err, result) =>{
        if(err) throw err;
        res.redirect('/Appoint_manage');
    });
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

app.get("/RegisterAccount",(req,res) => {
    res.render('RegisterAccount');
});



app.get("/Patient_appointment",(req,res) => {
    res.render('Patient_appointment');
});

app.get("/confirmation",(req,res) => {
    res.render('confirmation');
});


app.get("/PatientLoginInvalid",(req,res) => {
    res.render('PatientLoginInvalid');
});


app.get("/admin_loginInvalid",(req,res) => {
    res.render('admin_loginInvalid');
});

// set app port 
app.listen(8000);