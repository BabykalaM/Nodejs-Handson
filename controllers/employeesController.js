const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const getAllEmployees = (req, res) => {
  console.log("getAllEmployees", data.employees);

  res.json(data.employees);
};

const createNewEmployee = async (req, res) => {
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    dateofbirth: req.body.dateofbirth,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
  };

  if (
    !newEmployee.firstname ||
    !newEmployee.lastname ||
    !newEmployee.dateofbirth ||
    !newEmployee.email ||
    !newEmployee.phonenumber
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  console.log("newEmployee", newEmployee);

  data.setEmployees([...data.employees, newEmployee]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees)
  );
  res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  if (req.body.dateofbirth) employee.dateofbirth = req.body.dateofbirth;
  if (req.body.email) employee.email = req.body.email;
  if (req.body.phonenumber) employee.phonenumber = req.body.phonenumber;
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees)
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id)
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
