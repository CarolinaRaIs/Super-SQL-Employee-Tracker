--Insert sample departments
INSERT INTO department (name) 
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) 
VALUES ('Sales Manager', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2)
       ('Software Engineer', 90000, 2),
       ('Account Manager', 160000, 3)
       ('Accountant', 125000, 3),
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 190000, 4);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Juan', 'Guerrero', 1, NULL),
       ('Bobby', 'Fillet', 2, 1),
       ('Jabari', 'Jallow', 3, NULL),
       ('Kaya', 'Sahin', 4, 3),
       ('Lourdes', 'Laferte', 5, NULL),
       ('Diego', 'Santos', 6, 5),
       ('Claudia', 'Booker', 7, NULL),
       ('Isaac', 'Chen', 8, 7)

