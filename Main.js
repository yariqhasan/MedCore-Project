const express = require("express");
const bodyParser = require("body-parser");
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
const myFilePath = `/home/muszyn/Documents`
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
    res.redirect('PatientLogin');
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
                res.redirect("/PatientLogin");
                console.log(`Failed Login \n Results: ${results}`)
            }
            res.end();
        })
    }
})
//#endregion

//#region New Entry

app.post("/new_entry",encoder, function(req,res){
    var PID = req.body.PID;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var contact_num = req.body.contact_num;
    var address = req.body.address_num;
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
            return res.redirect(`/PatientLogin`);
        }
        else 
        {
            console.log(error)
            return res.redirect(`/RegisterAccount`);
        }
    })

})
//#endregion

//#region PatientList
app.get("/PatientList", (req, res) =>{
    assets.connection.query(`SELECT * FROM ${assets.schemaName}.patient `,(err, rows) => {
         if (err) throw err;
         console.log(rows);
         res.render("PatientList",{
             patient : rows
         });
    })
 });
 //#endregion

//#region Routes
app.get("",(req,res) => {
    res.render('index');
});
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
//#endregion