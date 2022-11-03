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

function createRow() {
  var table = document.getElementById("appointment-table")
  var row = table.insertRow(0)
  var cell1 = row.insertCell(0)
  var cell2 = row.insertCell(1)
  var cell3 = row.insertCell(2)
  var cell4 = row.insertCell(3)
  var cell5 = row.insertCell(4)
  var cell6 = row.insertCell(5)

  var checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.name = "name"
  checkbox.value = "value"
  checkbox.id = "id"

  cell1.appendChild(checkbox)
  cell2.innerHTML = document.getElementById("name").value
  cell3.innerHTML = document.getElementById("email").value
  cell4.innerHTML = document.getElementById("address").value
  cell5.innerHTML = document.getElementById("phone").value
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

function removeSelected(table) {
  for (var rowi = table.rows.length; rowi-- > 0; ) {
    var row = table.rows[rowi]
    var inputs = row.getElementsByTagName("input")
    for (var inputi = inputs.length; inputi-- > 0; ) {
      var input = inputs[inputi]

      if (input.type === "checkbox" && input.checked) {
        row.parentNode.removeChild(row)
        break
      }
    }
  }
}

function openForm() {
  document.getElementById("myForm").style.display = "block"
}

function closeForm() {
  document.getElementById("myForm").style.display = "none"
}
