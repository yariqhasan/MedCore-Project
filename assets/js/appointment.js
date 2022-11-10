scheduled_appointment = "November 15, 2022"

document.getElementById("Appointment_Date").innerHTML =
  scheduled_appointment

$(document).ready(function () {
  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip()

  // Select/Deselect checkboxes
  var checkbox = $('table tbody input[type="checkbox"]')
  $("#selectAll").click(function () {
    if (this.checked) {
      checkbox.each(function () {
        this.checked = true
      })
    } else {
      checkbox.each(function () {
        this.checked = false
      })
    }
  })
  checkbox.click(function () {
    if (!this.checked) {
      $("#selectAll").prop("checked", false)
    }
  })
})

// function required() {
//   var empt = document.forms["apt-form"]["name"].value
//   if (empt == "") {
//     alert("Please input a Value")
//     return false
//   } else {
//     createRow()
//   }
// }

function createRow() {
  var table = document.getElementById("appointment-table")
  var row = table.insertRow(0)
  var cell1 = row.insertCell(0)
  var cell2 = row.insertCell(1)
  var cell3 = row.insertCell(2)
  var cell4 = row.insertCell(3)
  var cell5 = row.insertCell(4)
  var cell6 = row.insertCell(5)
  var cell7 = row.insertCell(6)

  var checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.name = "element"
  checkbox.value = "value"
  checkbox.id = "id"

  cell1.appendChild(checkbox)
  cell2.innerHTML = document.getElementById("firstName").value
  cell3.innerHTML = document.getElementById("lastName").value
  cell4.innerHTML = document.getElementById("email").value
  cell5.innerHTML = document.getElementById("address").value
  cell6.innerHTML = document.getElementById("phone").value
  cell7.innerHTML = document.getElementById("doctorsName").value
  console.log(table)

  var rows = table.getElementsByTagName("tr")
  for (var i = 0; i <= rows.length; i++) {
    if (i % 2 == 0) {
      rows[i].style.backgroundColor = "#F5F5F5"
    } else {
      rows[i].style.backgroundColor = "#FFFFFF"
    }
  }
}

// function selectAll(source) {
//   checkboxes = document.getElementsByName("element")

//   for (var i = 0, n = checkboxes.length; i < n; i++) {
//     selectAll = checkboxes[i].checked = source.checked
//   }
//   this.onclick = unSelectAll

//   return selectAll
// }

// function unSelectAll(source) {
//   checkboxes = document.getElementsByName("element")

//   for (var i = 0, n = checkboxes.length; i < n; i++) {
//     checkboxes[i].checked = source.checked
//     checkboxes[i].checked = false
//   }
// }

// function deleteSelected() {
//   var table = document.getElementById("appointment-table")
//   // table.deleteRow(0)
//   checkboxes = document.getElementsByName("element")
//   selectAllBtn = document.getElementById("select")

//   for (var i = 0; i < selectAll; i++) {
//     table.innerHTML = ""
//     selectAllBtn.checked = false
//   }
// }

function openForm() {
  document.getElementById("myForm").style.display = "block"
}

function closeForm() {
  document.getElementById("myForm").style.display = "none"
}
