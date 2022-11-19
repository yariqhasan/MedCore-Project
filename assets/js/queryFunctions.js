const mysql = require("mysql2");

const schemaName = "clinic_data";
const dbPassword = "Dy3rmak3r";

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
    else console.log(`Connected to ${schemaName}!`)
});
async function getUserByEmail(loginId){
    var query = `select login.username from ${schemaName}.login where email = "${loginId}"`
    const results = await connection.promise().query(query)
    return results[0]
};
async function saveUserByEmail(loginId, ownIdData){
    var query = `UPDATE ${schemaName}.login SET ownIdData = "${ownIdData}" WHERE email = "${loginId}"`
    const results = await connection.promise().query(query)
    return results
};

module.exports = {
    getUserByEmail,
    saveUserByEmail,
    connection,
    schemaName,
}