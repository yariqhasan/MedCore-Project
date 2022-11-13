const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const encoder = bodyParser.urlencoded();

const app = express();
app.use(express.static('assets'))
app.use('/css',express.static(__dirname+ 'assets/css'));
app.use('/js',express.static(__dirname+ 'assets/js'));
app.use('/img',express.static(__dirname+ 'assets/img'));
app.use('/vendor',express.static(__dirname+ 'assets/vender'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname));


//set views
app.set('views', './views');
app.set('view engine', 'ejs');

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "6hadnu7iu9809cagediged9832acged790979daged890946898dasikes",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


// change to an available localhost port
// Can use Resource Monitor (Windows) to find available localports
const localHostPortNum = 1120;
const schemaName = "clinic_data";
const dbPassword = "admin";

//username and password
const myusername = ''
const myuserid=0



// a variable to save a session
var session;



// set app port 
app.listen(localHostPortNum);
//establish connection to your local database
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "mousumi",
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


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    session=req.session;
   
    const loginQuery = `select username, email from ${schemaName}.login where username = "${username}" and password = "${password}"`
    
    connection.query(loginQuery, function(error,results,fields){
        if (results.length > 0 && !error) {
            console.log(console.log(results[0]));
            var user_email =results[0].email
            // when login is success
            session.username =username;
            session.email = user_email;
            
            res.redirect("/Profile");
            console.log(`Successfull Login \n Results: ${user_email}`)
        } else{
            // login fails
            res.redirect("/PatientLogin");
            console.log(`Failed Login \n Results: ${results}`)
        }
        res.end();
    })
})


app.post("/admin_login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    session=req.session;
    const loginQuery = `select username, email from ${schemaName}.admin where username = "${username}" and password = "${password}"`
    
    connection.query(loginQuery, function(error,results,fields){
        if (results.length > 0 && !error) {
            session.admin_id =username;
            session.email =results[0].email;
            

            // when login is success
            res.redirect("/Patient_entry");
            console.log(`Successfull Login \n Results: ${results}`)
        } else{
            // login fails
            res.redirect("/admin_login");
            console.log(`Failed Login \n Results: ${results}`)
        }
        res.end();
    })
})

//New Patient Entry Form

app.post("/new_entry",encoder, function(req,res){

    session=req.session;
    if(!session.admin_id){
        res.redirect("/admin_login");
    }
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

})

//Fetch data from SQL to Table

app.get("/PatientList", (req, res) =>{

    session=req.session;
    if(!session.admin_id){
        res.redirect("/admin_login");
    }
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
    session=req.session;
    if(!session.username){
        res.redirect("/PatientLogin");
    }

    var email =session.email;

    var sql =`select medicine.Name, medicine.quantity, bill.total_price, \
    bill.covered_amount, bill.customer_price, DATE_FORMAT(invoice_date, "%m-%d-%y") as service_date \
     from patient inner join invoices \
   on patient.email_addr="${email}" and invoices.patient_id=patient.PID \
   inner join bill on bill.invoice_num=invoices.invoice_id and isPaid=0 inner join \
   medicine on medicine.medicine_ID=bill.medicine_ID`

   //console.log(sql);

    connection.query(sql,(err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.render("Check_out",{
            patient : rows
        });
   })
    
});
app.post("/Payment", encoder,(req,res) => {

    session=req.session;
    if(!session.username){
        res.redirect("/PatientLogin");
    }

    var email =session.email;
    var total = req.body.total;

    res.render('Payment', {
        total : total,
        email :email
    });
});

app.post("/ProcessPayment", encoder,(req,res) => {

    session=req.session;
    if(!session.username){
        res.redirect("/PatientLogin");
    }

    var useremail =session.email;
    var name =req.body.name;
    var address =req.body.address;
    var city =req.body.city;
    var state =req.body.state;
    var zip =req.body.zip;
    var email =req.body.email;
    var cardname =req.body.cardname;
    var cardnumber =req.body.cardnumber;
    var expmonth =req.body.expmonth;
    var expyear =req.body.expyear;
    var cvv =req.body.cvv;
    var amount =req.body.amount;
    var patient_email =session.email;
    var d = new Date();

    
    paymentDate = [ d.getFullYear(),d.getMonth()+1,
               d.getDate()
               ].join('-')+' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');

    var expDate = expyear+"/"+expmonth;
    var fullAddress = address+", "+city+", "+state+" "+zip ;

    //var valid = require("card-validator");

    //var numberValidation = valid.number(cardnumber);
    //var nameValidation =valid.cardholderName(cardname);
    //var expValidation =valid.expirationDate(expDate);
    
    //if ( nameValidation.isPotentiallyValid & expValidation.isPotentiallyValid)
    {
        var cardType="Visa";
        var randomstring = require("randomstring");
        var confirmCode = randomstring.generate({ length: 8, capitalization: "uppercase"});
        var sql = 'insert into processed_payment (confirm_code, amount, billing_name, patient_name,\
             cardnumber, exp_year, exp_month, cvv,address, \
            city, state, zip, date, billing_email, patient_email) Values ?';
        var values = [[confirmCode, amount, cardname, name, cardnumber, expyear, expmonth, cvv, address, city, state, zip, paymentDate, email, patient_email ]];
        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            res.render("PaymentApproved", {
                amount : amount,
                patient_email :patient_email, 
                confirmCode: confirmCode,
                cardType: cardType,
                paymentDate: paymentDate,
                cardname: cardname,
                fullAddress: fullAddress

            });
       });

    }   
});
app.get("/Profile",(req,res) => {
    if(!session.username){
        res.redirect("/PatientLogin");
    }
    res.render('Profile');
});
app.get("/Patient_entry",(req,res) => {
    session=req.session;
    if(!session.admin_id){
        res.redirect("/admin_login");
    }
    res.render('Patient_entry');
});
app.get("/Appointment",(req,res) => {
    session=req.session;
    if(!session.admin_id){
        res.redirect("/admin_login");
    }
    res.render('Appointment');
});

app.get("/RegisterAccount",(req,res) => {
    

    res.render('RegisterAccount');
});