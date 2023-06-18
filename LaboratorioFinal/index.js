function showErrorIcon(id, icon) {
    document.getElementById(id).style.borderColor = "red";
    document.getElementById(id).style.borderWidth = "2px";
    document.getElementById(icon).setAttribute("src","images/error-icon.svg");
    document.getElementById(icon).style.opacity = "1";
}

function showCheckIcon(id, icon, msgId) {
    document.getElementById(id).style.borderColor = "green";
    document.getElementById(id).style.borderWidth = "2px";
    document.getElementById(icon).setAttribute("src","images/success-icon.svg");
    document.getElementById(icon).style.opacity = "1";
    document.getElementById(msgId).style.opacity = "0";
}

function showErrorMessage(id, msg){
    document.getElementById(id).innerHTML = msg
    document.getElementById(id).style.opacity = "0.8";
}

function passLenValidation(password){
    var pass_length = password.length;
    if (pass_length < 4 || pass_length > 8){
        return true;
    }
    return false;
}

// name, surname validation
function validateName(id, icon, msgId){
    var a = document.forms["myForm"][id].value;
    const regexName = new RegExp(/(\d)|^(\s+)/gm)
    if (a == null || a == "") {
        showErrorIcon(id, icon);
        showErrorMessage(msgId, "Rellene este campo")
        return false;
    }else if(regexName.test(a)){
        showErrorIcon(id, icon);
        if(id == "name"){
            showErrorMessage(msgId, "Nombre no válido")
        }else{
            showErrorMessage(msgId, "Apellido no válido")
        }
        return false;
    }else{
        showCheckIcon(id, icon,msgId)
        return true;
    }  
}

// email validation
function validateEmail(){
    var b = document.forms["myForm"]["email"].value;
    if(b == null || b == ""){
        showErrorIcon("email", "iconEmail");
        showErrorMessage("emailMsg", "Rellene este campo")
        return false
    }else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(b)){
        showErrorIcon("email", "iconEmail");
        showErrorMessage("emailMsg", "Email inválido")
        return false;
    }else {
        showCheckIcon("email", "iconEmail","emailMsg")
        return true;
    }
}

//pass validation
function validatePass(){
    var c = document.forms["myForm"]["password"].value;
    if(c == null || c == ""){  
        showErrorIcon("password", "iconPass")
        showErrorMessage("passMsg", "Rellene este campo")
        return false
    }else if(passLenValidation(c)){
        showErrorIcon("password", "iconPass")
        showErrorMessage("passMsg", "Debe tener entre 4 y 8 caracteres")
        return false
    } else {
        showCheckIcon("password", "iconPass","passMsg")
        return true
    }
}


// login validation 
function validateLogin(){
    var d = document.forms["myForm"]["login"].value;
    if (d == null || d == ""){
        showErrorIcon("login", "iconlogin")
        showErrorMessage("loginMsg", "Rellene este campo")
        return false
    }else{
        showCheckIcon("login", "iconlogin","loginMsg")
        return true
    }
}


function validationName() { return validateName('name','iconName','nameMsg')}
function validationSurname1() { return validateName('surname1','iconSurName1','surname1Msg')}
function validationSurname2() { return validateName('surname2','iconSurName2','surname2Msg')}


function handleResponse(res) {
    if (!res.error) {
        alert("La inscripción se ha realizado correctamente. ¡Gracias!")
        document.getElementById("button").disabled = false;
        document.getElementById("clear").disabled = false;
        document.getElementById("submit").disabled = true;
    } else alert(res.error)
}

// form validation
function validateFormAndSubmit(e) {
    e.preventDefault()
    const isValid = [validationName, validationSurname1, validationSurname2, validateEmail, validateLogin, validatePass].reduce((valid, f) => f() && valid, true)


    if(isValid){
        var data = {
            name: document.forms["myForm"]["name"].value,
            surname1: document.forms["myForm"]["surname1"].value,
            surname2:document.forms["myForm"]["surname2"].value,
            email: document.forms["myForm"]["email"].value,
            login: document.forms["myForm"]["login"].value,
            password: document.forms["myForm"]["password"].value
        };
        
        var formBody = [];
        for (var property in data) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(data[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        fetch("http://localhost/LaboratorioFinal/form.php", { method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
        .then((response) => response.json())
        .then(handleResponse)
        .catch(res => {console.log(JSON.stringify(res, null, 2)); alert("¡Ups! Hubo un error con la inscripción. Inténtelo de nuevo.")})


    } else {
        return false;
    }
}

function printDB(tableArr){
  let table = document.getElementById('table');
  if (table.rows.length > 1) {
    table.innerHTML = table.rows[0].innerHTML;
  }
  for (let row of tableArr) {
    table.insertRow();
    for (let cell of Object.values(row)) {
      let newCell = table.rows[table.rows.length - 1].insertCell();
      newCell.textContent = cell;
    }
  }
}


function queryDB(){
    fetch("http://localhost/LaboratorioFinal/form.php", { method: 'GET' })
    .then((response) => response.json())
    .then(printDB)
    .catch(res => {console.log(JSON.stringify(res, null, 2)); alert("¡Ups! Hubo un error con la consulta. Inténtelo de nuevo.")})
}


function clearForm(){
    location.reload();
}