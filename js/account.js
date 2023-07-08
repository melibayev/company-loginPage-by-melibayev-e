const groupsFilter = document.querySelector(".groups-filter");
const groupsSelect = document.querySelector(".groups-select");
const addressSelect = document.querySelector(".address-select");
const positionSelect = document.querySelector(".position-select");
const typePositionSelect = document.querySelector(".typePosition-select");
const studentForm = document.querySelector(".student-form");
const studentsTableBody = document.querySelector(".students-table tbody");
const studentModal = document.querySelector("#studentModal");
const addStudentBtn = document.querySelector(".add-student-btn");
const openModalBtn = document.querySelector(".open-modal-btn");
const searchStudent = document.querySelector(".search-student");
const loader = document.querySelector('.loader')

let studentsJson = localStorage.getItem("students");
let students = JSON.parse(studentsJson) || [];

let userJson = localStorage.getItem("lastUser")
let user = JSON.parse(userJson);

let selected = null;
let search = "";
let category = localStorage.getItem("category") || "All Regions";

groupsFilter.innerHTML = `<option value='All Regions'>All Regions</option>`;

address.map((adr) => {
groupsFilter.innerHTML += `<option ${category === adr ? 'selected' : ''} value="${adr}">${adr}</option>`;
  addressSelect.innerHTML += `<option value="${adr}">${adr}</option>`;
});

position.map((pos) => {
    positionSelect.innerHTML += `<option value="${pos}">${pos}</option>`;
});
typePosition.map((typ) => {
    typePositionSelect.innerHTML += `<option value="${typ}">${typ}</option>`;
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (this.checkValidity()) {
    let student = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      address: this.address.value,
      position: this.position.value,
      typePosition: this.typePosition.value,
      salary: this.salary.value,
      isMarried: this.isMarried.checked,
    };
    if (selected === null) {
      students.push(student);
    } else {
      students[selected] = student;
    }
    bootstrap.Modal.getInstance(studentModal).hide();
    this.reset();
  } else {
    this.classList.add("was-validated");
  }
  localStorage.setItem("students", JSON.stringify(students));
  getStudents();
});

const getStudentRow = ({ firstName, lastName, group, address, position, typePosition, salary, isMarried }, i) => {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${address}</td>
      <td>${position}</td>
      <td>${typePosition}</td>
      <td>"${salary} $"</td>
      <td>${isMarried ? "Yes" : "No"}</td>
      <td class="text-end">
        <button
          data-bs-toggle="modal"
          data-bs-target="#studentModal"
          class="btn btn-primary"
          onClick="editStudent(${i})"
        >
          Edit
        </button>
        <button class="btn btn-danger" onClick="deleteStudent(${i})">Delete</button>
      </td>
    </tr>
  `;
};

function getStudents() {
  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  if (category !== "All Regions") {
    results = results.filter((student) => student.address === category);
  }

  studentsTableBody.innerHTML = "";

  if (results.length !== 0) {
    results.map((student, i) => {
      studentsTableBody.innerHTML += getStudentRow(student, i);
    });
  } else {
    studentsTableBody.innerHTML = `
      <td colspan="9">
        <div class="text-center alert alert-primary" role="alert">
          No Employees!
        </div>
      </td>
    `;
  }
}

getStudents();

function deleteStudent(i) {
  let isDelete = confirm("Do you want to delete this employee informations?");
  if (isDelete) {
    students.splice(i, 1);
    // students = students.filter((_, index) => index !== i);
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  }
}

function editStudent(i) {
  selected = i;
  let { firstName, lastName, address, position, typePosition, salary, isMarried } = students[i];
  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.address.value = address;
  studentForm.position.value = position;
  studentForm.typePosition.value = typePosition;
  studentForm.salary.value = salary;
  studentForm.isMarried.checked = isMarried;
  addStudentBtn.textContent = "Save";
}

openModalBtn.addEventListener("click", () => {
  studentForm.reset();
  selected = null;
  addStudentBtn.textContent = "Add";
});

searchStudent.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

groupsFilter.addEventListener("change", function () {
  category = this.value;
  localStorage.setItem("category", this.value);
  getStudents();
});

setTimeout(function() {
  var element = document.querySelector(".loader");
  element.classList.add("loader-hide");
}, 3500);

let userName = user.firstName;
userName = userName.charAt(0).toUpperCase() + userName.slice(1);
loader.innerHTML = `
  <h1>Welcome Back <br> ${userName}</h1>
`
