<?php
function validateField($field, $key, $array) {
    if (!array_key_exists($key, $array)) {
        // echo "$field no existe";
        header("Content-Type: application/json");
        echo json_encode(array("error" => "$field no existe"));
        exit(0);
    }

    switch ($key){
        case 'name':
        case 'surname1':
        case 'surname2': 
            if(preg_match("/(\d)|^(\s+)/gm",$array[$key]) == 1){
                // echo "$field no válido";
                header("Content-Type: application/json");
                echo json_encode(array("error" => "$field no válido"));
                exit(0);
            }
            break;
        case 'email':
            if(preg_match("/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/",$array[$key])!=1){
                // echo "$field no válido";
                header("Content-Type: application/json");
                echo json_encode(array("error" => "$field no válido"));
                exit(0);
            }
            break;
        case 'password':
            if(strlen($array[$key]) < 4 || strlen($array[$key]) > 8 ){
                // echo "$field no válido";
                header("Content-Type: application/json");
                echo json_encode(array("error" => "$field no válido"));
                exit(0);
            }
            break;
    }
}

if($_POST){

    // Field validation
    validateField('Nombre','name', $_POST);
    validateField('Primer apellido','surname1', $_POST);
    validateField('Segundo apellido','surname2', $_POST);
    validateField('Email','email', $_POST);
    validateField('Login','login', $_POST);
    validateField('Contraseña','password', $_POST);

    $name = $_POST['name'];
    $surname1 = $_POST['surname1'];
    $surname2 = $_POST['surname2'];
    $email = $_POST['email'];
    $login = $_POST['login'];
    $password = $_POST['password'];

    // Conexión con PDO
    $db_servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $db_name = "SamsungDevSpain";

    // Create connect
    $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

    // Check connection
    if($conn->connect_error){ 
        die("Connection failed: ".$conn->connect_error);
    }

    // Check if email address is on db
    $result = $conn->query("SELECT EMAIL FROM registro WHERE EMAIL='$email'");
    if($result->num_rows <= 0){
        $sql = "INSERT INTO registro (NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, EMAIL, LOGIN, PASSWORD)
        VALUES ('$name','$surname1','$surname2','$email','$login','$password')";

        if($conn->query($sql)=== TRUE){
            // echo "New record created sucessfully";
            header("Content-Type: application/json");
            echo json_encode(array("error" => ""));
        }else{
            // echo "Error: ".$sql."<br>".$conn->error;
            header("Content-Type: application/json");
            echo json_encode(array("error" => "Error: ".$sql."<br>".$conn->error));
        }
    }else{
        // echo "Usuario ya registrado" ;
        header("Content-Type: application/json");
        echo json_encode(array("error" => "Usuario ya registrado. Por favor, registrese con un nuevo correo electrónico."));
    }
    $conn->close();

} 
else {
    // Conexión con PDO
    $db_servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $db_name = "SamsungDevSpain";

    // Create connect
    $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

    $data = array();
    $result = mysqli_query($conn, "SELECT NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, EMAIL FROM registro");

    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            array_push($data, array("name" => $row["NOMBRE"], "surname1" => $row["PRIMER_APELLIDO"], "surname2" => $row["SEGUNDO_APELLIDO"], "email" => $row["EMAIL"]));
        }
    }
    

    header("Content-Type: application/json");
    echo json_encode($data);
    $conn->close();
}

?>