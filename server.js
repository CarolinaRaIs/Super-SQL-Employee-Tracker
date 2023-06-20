const mysql = require('mysql2');
require('dotenv').config();
const inquirer = require("inquirer");

// Create a non-promise connection to the database
const con = mysql.createConnection({
  host: 'localhost',
   // Your port; if not 3306
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//promise function called on connection to upgrade the non-promise connection to use Promises
const connection = con.promise();

//Departments:

//perform query and return results
// async keyword enables use of await within function
async function getAllDepartments() {
  try {
    // The connection.query method, which now returns a Promise due to the connection upgrade, is used with the await keyword to perform the query asynchronously. 
    // The Promise resolves when the query is completed, allowing the rest of the function to continue executing without blocking other operations.
    // connection.query() returns an array containing two elements: the result of the query(data retrieved from the db) and the metadata(information about the columns and table, etc).
        // const [departments] --> (brackets = array deconstructuring) telling JavaScript to assign the first element of the returned array (the query result which is the data) to the departments variable.
    // SELECT * FROM department --> retrieves all the columns and rows from the department table
    const [departments] = await connection.query('SELECT * FROM department');
    return departments;
  } catch (error) {
    console.log(error);
  }
}

// add a new department based on the name of the department
async function addDepartment(name) {
    try {
        //'INSERT INTO department (name) VALUES (?)' = SQL query string = instructs the database to insert a new row into the department table with the specified name
                // ? = a placeholder for the actual value of the name parameter.
                // [name] = an array containing the actual value of the name parameter. It is used to replace the ? placeholder in the SQL query string.
        await connection.query('INSERT INTO department (name) VALUES (?)', [name]);
    } catch (error) {
        console.log(error);
    }
}


//Roles:
async function getAllRoles() {
    try {
        const [roles] = await connection.query('SELECT*FROM role')
        return roles;
    }
}









module.exports = {
  getAllDepartments,
};






