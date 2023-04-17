DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;
/* id: The name of the column.
  INT: The data type of the column, which is an integer in this case.
  AUTO_INCREMENT: A MySQL attribute that automatically generates a unique, incremental integer value for each new row inserted into the table. The value starts at 1 and increments by 1 for each new row.
  PRIMARY KEY: This indicates that the id column is the primary key for the table. A primary key is a unique identifier for each row in a table*/
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    -- The foreign key constraint ensures that any value entered in the department_id column of the current table must exist as a value in the id column of the department table. This relationship enforces data consistency between the tables and prevents orphaned records that do not have a corresponding entry in the related table.
    /* FOREIGN KEY (department_id): specifies that the department_id column in the current table will be a foreign key.
       REFERENCES department(id): indicates that the department_id column references the id column of the department table. */
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    -- Include employee manader or write null if no manager 
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    -- The manager_id column is essentially pointing to the id of another row in the same employee table, where that row represents the manager of the current employee. So, the foreign key relationship is between manager_id in the employee table and id in the same employee table.
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);