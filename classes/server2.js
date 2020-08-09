var mysql = require("mysql");
const inquirer = require("inquirer");

let Department = require("./department.js");
let Role = require("./role.js");
let Employee = require("./employee.js");

let departments = [];
let roles = [];
let employees = [];

let options = [
  "Add department",
  "Add role",
  "Add employee",
  "View departments",
  "View roles",
  "View employees",
  "View employees by manager",
  "View the total utilized budget of a department",
  "Update roles",
  "Update employee manager",
  "Delete department",
  "Delete role",
  "Delete employee",
  "Exit",
];
let roleQuestions = [
  {
    name: "role_title",
    type: "input",
    message: "Enter role title",
  },
  {
    name: "role_salary",
    type: "input",
    message: "Enter role salary",
  },
];
let employeeQuestions = [
  {
    name: "first_name",
    type: "input",
    message: "Enter employee first name",
  },
  {
    name: "last_name",
    type: "input",
    message: "Enter employee last name",
  },
];

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ukrayina91",
  database: "employee_tracker_db",
  multipleStatements: true,
});
con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected");

  let sql =
    "SELECT * FROM department; SELECT * FROM role; SELECT * FROM employee";
  con.query(sql, (err, row) => {
    if (err) throw err;
    for (dep of row[0]) {
      //console.table(dep)
      let temp = new Department(dep.id, dep.name);
      departments.push(temp);
    }
    for (role of row[1]) {
      let temp = new Role(role.id, role.title, role.salary, role.department_id);
      roles.push(temp);
    }
    for (emp of row[2]) {
      let temp = new Employee(
        emp.id,
        emp.first_name,
        emp.last_name,
        emp.role_id
      );
      if (emp.manager_id) {
        temp.setManagerId(emp.manager_id);
      }
      employees.push(temp);
    }

    start();
  });
});

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: options,
    })
    .then((answer) => {
      if (answer.action == "Add department") {
        addDepartment();
      }
      if (answer.action == "Add role") {
        addRole();
      }
      if (answer.action == "Add employee") {
        addEmployee();
      }
      if (answer.action == "View departments") {
        let sql = "SELECT * FROM department;";
        con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      if (answer.action == "View roles") {
        let sql = "SELECT * FROM role;";
        con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      if (answer.action == "View employees") {
        let sql = "SELECT * FROM employee;";
        con.query(sql, (err, row) => {
          if (err) throw err;
          console.table(row);
          start();
        });
      }
      if (answer.action == "View employees by manager") {
        viewByManager();
      }
      if (answer.action == "View the total utilized budget of a department") {
        totalBudget();
      }
      if (answer.action == "Update roles") {
        updateEmpRole();
      }
      if (answer.action == "Update employee manager") {
        updateEmpManager();
      }
      if (answer.action == "Delete department") {
        deleteDepartments();
      }
      if (answer.action == "Delete role") {
        deleteRole();
      }
      if (answer.action == "Delete employee") {
        deletedEmployee();
      }
      if (answer.action == "Exit") {
        process.exit();
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department_name",
      type: "input",
      message: "Enter department name",
    })
    .then((input) => {
      if (input) {
        let sql = `INSERT INTO department (name) VALUES ("${input.department_name}");`;
        con.query(sql, (err, row) => {
          if (err) throw err;
          let temp = new Department(row.insertId, input.department_name);
          departments.push(temp);
          console.log("Department added");
          start();
        });
      }
    });
};
const addRole = () => {
  let deps = [];
  for (dep of departments) {
    deps.push(dep.getName());
  }

  inquirer.prompt(roleQuestions).then((answer) => {
    let title = answer.role_title;
    let salary = answer.role_salary;

    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Select department",
        choices: deps,
      })
      .then((input) => {
        let index = deps.indexOf(input.department);
        let id = departments[index].getID();
        let sql = `INSERT INTO role (department_id, title, salary) VALUES ("${id}", "${title}", "${salary}");`;
        con.query(sql, (err, row) => {
          if (err) throw err;
          let temp = new Role(row.insertId, title, salary, id);
          roles.push(temp);
          console.log(roles);
          console.log("Role added");
          start();
        });
      });
  });
};
const addEmployee = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer.prompt(employeeQuestions).then((answer) => {
    let firstName = answer.first_name;
    let lastName = answer.last_name;

    inquirer
      .prompt({
        name: "rol",
        type: "list",
        message: "Select role",
        choices: role,
      })
      .then((input) => {
        let index = role.indexOf(input.rol);
        let role_id = roles[index].getID();
        inquirer
          .prompt({
            name: "manager",
            type: "list",
            message: "Select manager",
            choices: employee,
          })
          .then((input) => {
            let index = employee.indexOf(input.manager);
            let manager_id = employees[index].getID();
            let sql = `INSERT INTO employee (role_id, first_name, last_name, manager_id) VALUES ("${role_id}", "${firstName}", "${lastName}", "${manager_id}");`;
            if (index === employee.length - 1) {
              sql = `INSERT INTO employee (role_id, first_name, last_name) VALUES ("${role_id}", "${firstName}", "${lastName}");`;
            }
            con.query(sql, (err, row) => {
              if (err) throw err;
              let temp = new Employee(
                row.insertId,
                firstName,
                lastName,
                role_id
              );
              if (manager_id) {
                temp.setManagerId(manager_id);
              }
              employee.push(temp);
              console.log(employee);
              console.log("Employee added");
              start();
            });
          });
      });
  });
};
const updateEmpRole = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }

  let employeeNames = [];
  for (emp of employees) {
    employeeNames.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employeeNames,
    })
    .then((input) => {
      let indexEmp = employeeNames.indexOf(input.name);
      let id = employees[indexEmp].getID();
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Select role",
          choices: role,
        })
        .then((input) => {
          let index = role.indexOf(input.role);
          let role_id = roles[index].getID();
          let sql = `UPDATE employee SET role_id=${role_id} WHERE id=${id};`;

          con.query(sql, (err, row) => {
            if (err) throw err;
            employees[indexEmp].setRoleId(role_id);
            console.log("Role updated");
            console.log(employees[indexEmp]);
            start();
          });
        });
    });
};
const viewByManager = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let index = employee.indexOf(input.name);
      let man_id = employees[index].getID();
      let sql2 = `SELECT * FROM employee WHERE manager_id="${man_id}"`;
      con.query(sql2, (err, row) => {
        if (err) throw err;
        console.table(row);
        start();
      });
    });
};
const updateEmpManager = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }

  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let indexEmp = employee.indexOf(input.name);
      let id = employees[indexEmp].getID();
      inquirer
        .prompt({
          name: "manager",
          type: "list",
          message: "Select manager",
          choices: employee,
        })
        .then((input) => {
          let index = employee.indexOf(input.manager);
          let emp_id = employees[index].getID();
          let sql = `UPDATE employee SET manager_id=${emp_id} WHERE id=${id};`;
          con.query(sql, (err, row) => {
            if (err) throw err;
            employees[indexEmp].setRoleId(emp_id);
            console.log("Employee manager updated");
            console.log(employees[indexEmp]);
            start();
          });
        });
    });
};
const totalBudget = () => {
  let department = [];
  for (dep of departments) {
    department.push(dep.getName());
  }
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Select department to view budget",
      choices: department,
    })
    .then((input) => {
      let sql = `CREATE TABLE sumSalary ( SELECT employee.first_name, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON department.id = role.department_id AND department.name = "${input.department}"); SELECT SUM(salary) total FROM sumSalary; DROP TABLE sumSalary;`;
      con.query(sql, (err, row) => {
        if (err) throw err;
        console.table(row[1]);
        start();
      });
    });
};
const deleteDepartments = () => {
  let departmentDel = [];
  for (dep of departments) {
    departmentDel.push(dep.getName());
  }
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Select department to delete",
      choices: departmentDel,
    })
    .then((input) => {
      let sql = `DELETE FROM department WHERE name="${input.department}"`;
      con.query(sql, (err, row) => {
        if (err) throw err;
        console.log("Department deleted");
        start();
      });
    });
};
const deleteRole = () => {
  let role = [];
  for (rol of roles) {
    role.push(rol.getTitle());
  }
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Select role",
      choices: role,
    })
    .then((input) => {
      let index = role.indexOf(input.role);
      let role_id = roles[index].getID();
      let sql = `DELETE FROM role WHERE id="${role_id}"`;
      con.query(sql, (err, row) => {
        if (err) throw err;
        console.log("Role deleted");
        start();
      });
    });
};
const deletedEmployee = () => {
  let employee = [];
  for (emp of employees) {
    employee.push(emp.getFirstName() + " " + emp.getLastName());
  }
  inquirer
    .prompt({
      name: "name",
      type: "list",
      message: "Select employee",
      choices: employee,
    })
    .then((input) => {
      let index = employee.indexOf(input.name);
      let id = employees[index].getID();
      let sql = `DELETE FROM employee WHERE id=${id}`;
      con.query(sql, (err) => {
        if (err) throw err;
        console.log("Employee deleted");
        start();
      });
    });
};

