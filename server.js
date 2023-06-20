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
    var query = "SELECT * FROM employees";
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
  var query =
  //aliases= used to create shorthand references to the tables in the rest of the query.
  //employee is aliased as e, role is aliased as r, and department is aliased as d
  var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
	  ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

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

// User chooses from the department list, then list of employees should appear
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
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      // SQL query to retrieve employees of the selected department
      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
        FROM employee e
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
        console.log(res.affectedRows + "Employees fetched!\n");

        // Return to the main menu after displaying the results
        firstPrompt();
      });
    });
}



function addEmployee() {
    // logic to add employee
    // call start() when done
}

function removeEmployee() {
    // logic to remove employee
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







