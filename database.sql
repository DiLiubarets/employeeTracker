DROP DATABASE IF EXISTS employee_tracker_db;
-- Create a database called programming_db --
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30)
);
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT
);
CREATE TABLE employee (
id INT PRIMARY KEY AUTO_INCREMENT,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id INT,
 manager_id INT NULL
);

INSERT INTO department (name)
VALUES ("web");
INSERT INTO department (name)
VALUES ("sales");

INSERT INTO role (title, salary, department_id) VALUES ("front_end", 1000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("back_end", 2000, 1);

INSERT INTO role (title, salary, department_id) VALUES ("rep", 1000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("manager", 2000, 2);


INSERT INTO employee (role_id, first_name, last_name) VALUES (1, "Alex", "P");
INSERT INTO employee (role_id, first_name, last_name) VALUES (2, "Dina", "L");
INSERT INTO employee (role_id, first_name, last_name) VALUES (3, "Nika", "L");
INSERT INTO employee (role_id, first_name, last_name) VALUES (4, "Mira", "L");
INSERT INTO employee (role_id, first_name, last_name) VALUES (1, "Victor", "P");


