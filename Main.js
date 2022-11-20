const express = require("express");
const bodyParser = require("body-parser");
const { getUserByEmail } = require("./assets/js/queryFunctions");
const encoder = bodyParser.urlencoded({extended: true});


const app = express();
app.use(express.static('assets'))
app.use('/css',express.static(__dirname+ 'assets/css'));
app.use('/js',express.static(__dirname+ 'assets/js'));
app.use('/img',express.static(__dirname+ 'assets/img'));
app.use('/vendor',express.static(__dirname+ 'assets/vender'));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

//include folder
const myFilePath = String.raw`/home/muszyn/Documents`;
const assets = require(`${myFilePath}/MedCore-Project/assets/js/queryFunctions`);
//set views
app.set('views', './views');
app.set('view engine', 'ejs');
// change to an available localhost port
// Can use Resource Monitor (Windows) to find available localports
const localHostPortNum = 1120;
app.listen(localHostPortNum);

//#region OwnID
app.post('/setOwnIDDataByLoginId', async (req, res) => {
    const user = assets.getUserByEmail(req.body.loginId);
    if(!user){
        console.log(req.body.loginId);
        return res.json({errorCode: 404})
    }
    assets.saveUserByEmail(req.body.loginId,req.ownIdData);
    return res.sendStatus(204);
});

app.post('/getOwnIDDataByLoginId', async (req, res) => {
    const user = assets.getUserByEmail(req.body.loginId);
    if(!user){
        return res.json({errorCode: 404})
    }
    res.json({ownIdData: user.ownIdData})
});

app.post('/getSessionByLoginId', async (req, res) => {
    const sign = require('jwt-encode');
    const user = assets.getUserByEmail(req.body.loginId);
    if (!user) {
        return res.json({errorCode: 404})
    }
    const jwt = sign({email: user.email}, 'secret');
    res.json({token: jwt});
});
//#endregion
//#region Login
app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    const loginQuery = `select * from ${assets.schemaName}.login where username = "${username}" and password = "${password}"`
    if((username && password) != null){
        assets.connection.query(loginQuery, function(error,results,fields){
            if(username.length == 0 || password.length == 0){
                res.redirect("PatientLogin");
                return;
            }
            if (results.length > 0 && !error) {
                // when login is success
                res.redirect("/Profile");
                console.log(`Successfull Login \n Results: ${results}`)
            } else{
                // login fails
                res.redirect("/PatientLoginInvalid");
                console.log(`Failed Login \n Results: ${results}`)
            }
            res.end();
        })
    }
});
// Fetch data from admin table.
app.post("/admin_log",encoder, function(req,res){
    var username = req.body.email;
    var password = req.body.password;
    const loginQuery = `select * from ${assets.schemaName}.login where email = "${username}" and password = "${password}"`

        if((username && password) != null){
            assets.connection.query(loginQuery, function(error,results,fields){
                if(username.length == 0 || password.length == 0){
                    res.redirect("/admin_login");
                    return;
                }
                if (results.length > 0 && !error) {
                    // when login is success
                    res.redirect("/Patient_entry");
                    console.log(`Successfull Login \n Results: ${results}`)
                } else{
                    // login fails
                    res.redirect("/admin_loginInvalid");
                    console.log(`Failed Login \n Results: ${results}`)
                }
                res.end();
})}
        });
//#endregion

//#region New Entry

app.post("/new_entry",encoder, function(req,res){
    var PID = req.body.PID;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var contact_num = req.body.contact_num;
    var address = req.body.address;
    var email_addr = req.body.email_addr;
    var sex = req.body.sex;
    
    var sql = `insert into ${assets.schemaName}.patient (PID, first_name, last_name, contact_num, address, email_addr,sex) Values ?`;
    var values = [[PID,first_name,last_name,contact_num,address,email_addr,sex]];
    assets.connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/Patient_entry");
   });

});
//#endregion

//#region CreateUser
app.post("/register", encoder, function(req, res){
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    const createAccountQuery = `INSERT INTO ${assets.schemaName}.login (username, password, email) VALUES ("${username}", "${password}", "${email}")`
    if(!username | !password){
        return res.redirect(`/RegisterAccount`);
    }
    assets.connection.query(createAccountQuery, function(error, results, fields){
        if(!error) {
            console.log(`User ${username} created successfully`)
            return res.redirect(`/Profile`);
        }
        else 
        {
            console.log(error)
            return res.redirect(`/RegisterAccount`);
        }
    })
});
//#endregion
//Fetch data from Patient table
app.get("/PatientList", (req, res) =>{
    assets.connection.query(`SELECT * FROM ${assets.schemaName}.patient `,(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("PatientList",{
             patient : rows
         });
    })
 });
// Fetch data from appointment table
 app.get("/Appoint_manage", (req, res) =>{
    assets.connection.query(`SELECT * FROM ${assets.schemaName}.appointment `,(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("Appoint_manage",{
             appointment : rows
         });
    })
 });

 app.get("/Patient_appointment", (req, res) =>{
    var loggedInUser =  'Yariq';
    assets.connection.query(`SELECT doc_last_name, patient_last_name, contact_num, date, appointment_date, patient_first_name, 
        service_name FROM ${assets.schemaName}.appointment WHERE patient_first_name = "${loggedInUser}"`,(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("Patient_appointment",{
             myappoint : rows
         });
    })
 });

 app.get("/Profile", (req, res) =>{
    assets.connection.query(`SELECT Name,price,quantity FROM ${assets.schemaName}.medicine`,(err, rows) => {
        if (err) throw err;
         console.log(rows);
         res.render("Profile",{
            medications : rows
         });
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


    
    var sql = `insert into ${assets.schemaName}.appointment (appoint_num, patient_first_name, patient_last_name, contact_num, appointment_date, service_name,doc_last_name) Values ?`;
    var values = [[appoint_ID,patient_first_name,patient_last_name,contact_num,appointment_date,service_name,doctor]];
    assets.connection.query(sql, [values], function (err, result) {
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



    
    var sql = `INSERT INTO ${assets.schemaName}.processed_payment (confirm_code, amount, billing_name, patient_name, card_name, cardnumber, exp_year, exp_month, cvv, address, city, state, zip, date, billing_email, patient_email) VALUES ?`;
        var values = [[confirmCode,amount,patient_name,patient_name,cardname,cardnumber,expyear,expmonth,cvv,address,city,state,zip, date, patient_email,patient_email]];
    assets.connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.redirect("/confirmation");
   });

});





 // edit appointment table

 app.post("/appointment_edit",encoder, function(req,res){
    const appoint_id= req.body.appoint_num;
    var sql = `update ${assets.schemaName}.appointment SET appoint_num="`+req.body.appoint_num+'", patient_first_name="'+req.body.patient_first_name+'", patient_last_name="'+req.body.patient_last_name+'", contact_num="'
    +req.body.contact_num+'", appointment_date="'+req.body.appointment_date+'", service_name="'+req.body.service_name+'", doc_last_name="'+req.body.doc_last_name+'" where appoint_num='+appoint_id;
    assets.connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect("/Appoint_manage");
   });
});

app.get("/edit1/:appoint_id",(req, res) => {
    const appoint_id = req.params.appoint_id;
    assets.connection.query(`SELECT * FROM ${assets.schemaName}.appointment where appoint_num = ${appoint_id}`,(err, result) => {
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
    let sql = `DELETE FROM ${assets.schemaName}.appointment WHERE appoint_num = ${appoint_id}`;
    let query = assets.connection.query(sql, (err, result) =>{
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
app.get("/",(req,res) => {
    res.render('index');
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

app.get("/chat",(req,res) => {
    res.render('admin_loginInvalid');
});


