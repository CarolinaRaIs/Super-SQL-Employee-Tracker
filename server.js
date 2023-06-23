//Import dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
//Need dotenv so that server file can pull from .env file (added security, process.env variables), .env file needs to be at root of directory
require('dotenv').config();

//Import functions from prompt.js file
const { 
  firstPrompt, 
  //promptDepartment, 
  promptAddEmployee, 
  promptDeleteEmployee, 
  promptEmployeeAndRole, 
  promptAddRole } = require("./lib/prompt");

//console.log('DB_USER:', process.env.DB_USER);
//console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  

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
    // Font name:Doom, w:Smush (R), h:Smush (U): http://patorjk.com/software/taag/#p=testall&h=2&v=3&f=Train&t=TeamManagerPro
    console.log(`
    _____                   ___  ___                                 ______          
    |_   _|                  |  \\/  |                                 | ___ \\         
      | | ___  __ _ _ __ ___ | .  . | __ _ _ __   __ _  __ _  ___ _ __| |_/ / __ ___  
      | |/ _ \\/ _\` | '_ \` _ \\| |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|  __/ '__/ _ \\
      | |  __/ (_| | | | | | | |  | | (_| | | | | (_| | (_| |  __/ |  | |  | | | (_) |
      \\_/\\___|\\__,_|_| |_| |_|\\_|  |_/\\__,_|_| |_|\\__,_|\\__, |\\___|_|  \\_|  |_|  \\___/ 
                                                        __/ |                         
                                                       |___/   
`);

    //initiates app
    start();
});

function start() {
    //prompts the user for what action they want to make in the database
    firstPrompt()
        .then(answer => {
            switch(answer.action) {
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
                    removeEmployee();
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

// Retrieve all employee records from the database and display them
// This function executes a SELECT query to fetch all employee data
// It then prints the employee information to the console using console.table
// Finally, it calls the start() function to return to the main menu
function viewEmployees() {
    // logic to view employees
    // call start() when done
    console.log("Viewing employees\n");

    // Perform database query to retrieve employees
    //var query = "SELECT * FROM employees";
    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    LEFT JOIN role r
	  ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employees m
	  ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
      if (err) throw err;
  
      // Display employees using console.table
      console.table(res);
      console.log("Employees viewed!\n");
  
      // Call start() to continue the prompt
      start();
    });
}

// Retrieve and display employees by department
// This function executes a SQL query to retrieve employee data based on the department
// It then prints the department's id, name, and the budget (salary) of employees in that department
// The retrieved data is displayed in a table using console.table
// Finally, it prompts the user to choose a department from the available choices
function viewEmployeesByDepartment() {
  console.log("Viewing employees by department\n");

  // SQL query to select department information and the budget (salary) for each department

  //aliases= used to create shorthand references to the tables in the rest of the query.
  //employee is aliased as e, role is aliased as r, and department is aliased as d
  var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employees e
    LEFT JOIN role r
	  ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name, r.salary`

  // Executes the SQL query to retrieve department information
  connection.query(query, function (err, res) {
    if (err) throw err;

    // Create an array of department choices based on the query result
    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    console.log("Department view succeed!\n");

    promptDepartment(departmentChoices);
  });
}

//Prompt the user to choose a department from a list of available departments. 
//Once the user selects a department, the function executes a database query to retrieve the employees belonging to that department. 
//It then displays the employee information in the console.
function promptDepartment(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to choose?",
        choices: departmentChoices
      }
    ])
  .then(answer => {
    console.log("answer ", answer.departmentId);

    // SQL query to retrieve employees of the selected department
    var query =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
      FROM employees e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON d.id = r.department_id
      WHERE d.id = ?`;

    connection.query(query, answer.departmentId, function (err, res) {
      if (err) throw err;
      // Display the employee records in a formatted table
      console.table("response ", res);
       // res.affectedRows= Print the number of affected rows (number of employees viewed)
          //In this case, it represents the number of employees that were selected and retrieved from the database based on the chosen department. By printing this value along with the message "Viewed employees!", 
          //it provides feedback to the user on how many employees were fetched and displayed.
      console.log(res.affectedRows + "employees are being viewed!\n");

      // Return to the main menu after displaying the results
      start();
    });
  });
}



function addEmployee() {
  //By including "\n", the subsequent console output will start on a new line, improving the visual structure and readability of the displayed information.
  console.log("Adding an employee\n");

  // Perform database queries to retrieve roles and managers
  var roleQuery = "SELECT * FROM roles";
  var managerQuery = "SELECT * FROM employees";
  Promise.all([
    connection.query(roleQuery),
    connection.query(managerQuery)
  ])
    .then(([roles, managers]) => {
      // Create an array of role titles for the prompt
      const roleChoices = roles.map(({ id, title }) => ({
        value: id, name: `${id} ${title}`
      }));

      // Create an array of manager names for the prompt
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        value: id, name: `${id} ${first_name} ${last_name}`
      }));

      // Prompt the user to enter employee details
      promptAddEmployee
        .then(function (answer) {
          // Construct the SQL query to insert the new employee
          var query = "INSERT INTO employees SET ?";
          var employeeData = {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role_id,
            manager_id: answer.manager_id
          };

          // Execute the insertion query
          connection.query(query, employeeData, function (err, res) {
            if (err) throw err;
            console.log("Employee added!\n");
            // Return to the main menu
            start(); 
          });
        });
    });
    
}

function removeEmployee() {
  console.log("Removing an employee\n");

  // Perform database query to retrieve employees
  var query = "SELECT * FROM employees";
  connection.query(query, function (err, employees) {
    if (err) throw err;

    // Create an array of employee choices for the prompt
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    // Prompt the user to select an employee to remove
    promptDeleteEmployee(employeeChoices)
      .then(function (answer) {
        // Construct the SQL query to remove the selected employee
        var query = "DELETE FROM employees WHERE ?";
        var employeeId = { id: answer.employeeId };

        // Execute the deletion query
        connection.query(query, employeeId, function (err, res) {
          if (err) throw err;
          console.log("Employee removed!\n");
          // Return to the main menu
          start(); 
        });
      });
  });
}

function updateEmployeeRole() {
  console.log("Updating an employee's role\n");

  // Perform database queries to retrieve employees and roles
  var employeeQuery = "SELECT * FROM employees";
  var roleQuery = "SELECT * FROM roles";
  Promise.all([
    connection.query(employeeQuery),
    connection.query(roleQuery)
  ])
    .then(([employees, roles]) => {
      // Create an array of employee choices for the prompt
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        value: id, name: `${id} ${first_name} ${last_name}`
      }));

      // Create an array of role choices for the prompt
      const roleChoices = roles.map(({ id, title }) => ({
        value: id, name: `${id} ${title}`
      }));

      // Prompt the user to select an employee and a new role
      promptEmployeeAndRole(employeeChoices, roleChoices)
        .then(function (answer) {
          // Construct the SQL query to update the employee's role
          var query = "UPDATE employees SET ? WHERE ?";
          var employeeData = {
            role_id: answer.roleId
          };
          var employeeId = { id: answer.employeeId };

          // Execute the update query
          connection.query(query, [employeeData, employeeId], function (err, res) {
            if (err) throw err;
            console.log("Employee role updated!\n");
            // Return to the main menu
            start(); 
          });
        });
    });
}

function addRole() {
  console.log("Adding a role\n");

  // Perform database query to retrieve departments
  var query = "SELECT * FROM departments";
  connection.query(query, function (err, departments) {
    if (err) throw err;

    // Create an array of department choices for the prompt
    const departmentChoices = departments.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    // Prompt the user to enter role details
    promptAddRole(departmentChoices)
      .then(function (answer) {
        // Construct the SQL query to insert the new role
        var query = "INSERT INTO roles SET ?";
        var roleData = {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.departmentId
        };

        // Execute the insertion query
        connection.query(query, roleData, function (err, res) {
          if (err) throw err;
          console.log("Role added!\n");
          // Return to the main menu
          start(); 
        });
      });
  });
}







