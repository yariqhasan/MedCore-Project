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

app.post('/getMedicineInfo', async (req,res)=>{
    const query = `select * from ${schemaName}.medicine`;
    connection.query(query, function(error,results,fields){
        if(error){
            console.log(error);
            throw error;
        }
        console.log(results[0].objid);
    });
    res.json({results});
});

app.post('/ownId/setOwnIDDataByLoginId', async (req, res) => {
    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const ownIdData = req.body.ownIdData; //OwnID authentication information as string
    const user = await user.findOne({ email: email }).exec();
    user.ownIdData = ownIdData;
    await user.save();
    return res.sendStatus(204);
});

app.post('/ownId/getOwnIDDataByLoginId', async (req, res) => {
    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const user = await user.findOne({ email: email }).exec();
    if (!user) { return res.json({ errorCode: 404 }) } //Error code when user doesn't exist
    res.json({ ownIdData: user.ownIdData }) //OwnID authentication information as string
});

app.post('/ownId/getSessionByLoginId', async (req, res) => {
    const sign = require('jwt-encode');

    const email = req.body.loginId; //The unique id of a user in your database, usually email or phone
    const user = await user.findOne({ email: email }).exec();
    const jwt = sign({ email: user.email }, 'secret');
    return res.json({ token: jwt });
});




app.post("/login",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    const loginQuery = `select * from ${schemaName}.login where username = "${username}" and password = "${password}"`
    const employeeLoginQuery = `select * from ${schemaName}.login where username = "${username}" and password = "${password}"`
    connection.query(loginQuery, function(error,results,fields){
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
            res.redirect("/PatientLogin");
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
    
    var sql = `insert into ${schemaName}.patient (PID, first_name, last_name, contact_num, address, email_addr,sex) Values ?`;
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
app.get("/RegisterAccount",(req,res) => {
    res.render('RegisterAccount');
});
app.get("/DoctorBilling", (req,res) => {
    res.render('DoctorBilling');
});