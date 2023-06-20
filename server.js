//Import dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
//Import functions from prompt.js file
const { 
  firstPrompt, 
  promptDepartment, 
  promptAddEmployee, 
  promptDeleteEmployee, 
  promptEmployeeAndRole, 
  promptAddRole } = require("./prompt");

// Create a non-promise connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
   // Port; if not 3306
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // Font name:Ogre, w:Smush (R), h:Smush (U): http://patorjk.com/software/taag/#p=testall&h=2&v=3&f=Train&t=TeamManagerPro
    console.log(``)
    //initiates app
    start();
});

function start() {
    //prompts the user for what action they want to make in the database
    firstPrompt()
        .then(answer => {
            switch(answer.action) {
              //All these function imported at start of server.js and come from prompt.js
                case "View Employees":
                    viewEmployees();
                    break;
                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employees":
                    removeEmployees();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "End":
                    connection.end();
                    break;
            }
        });
}

function viewEmployees() {
    // logic to view employees
    // call start() when done
}

function viewEmployeesByDepartment() {
    // logic to view employees by department
    // call start() when done
}

function addEmployee() {
    // logic to add employee
    // call start() when done
}

function removeEmployees() {
    // logic to remove employees
    // call start() when done
}

function updateEmployeeRole() {
    // logic to update employee role
    // call start() when done
}

function addRole() {
    // logic to add role
    // call start() when done
}






module.exports = {
  getAllDepartments,
};






