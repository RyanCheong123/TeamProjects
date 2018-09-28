<?php

    $methodType = $_SERVER['REQUEST_METHOD'];
    $data = array("status" => "fail", "msg" => "On $methodType");

    $DBHost = "localhost";
    $dblogin = "ticom_root";
    $DBpassword = "password";
    $DBname = "ticom_COMP2910";

//    $DBHost = "localhost";
//    $dblogin = "root";
//    $DBpassword = "";
//    $DBname = "2910project";


    // to see you will need to type this in the URL bar of your browser:
    // http://localhost/lab_7/lab_07_GetTable.php?output=json
    // Note: you may also need to include a port (check XAMPP/WAMP/LAMP/MAMP for the port)
    if ($methodType === 'GET') {
        if(isset($_GET['output'])) {
            $output = $_GET['output'];
            
            try {
            $conn = new PDO("mysql:host=$DBHost;dbname=$DBname", $dblogin, $DBpassword);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


            // SUBQUERY (I.E., SELECT) - GET ALL EMAILS ADDRESSES BASED ON A STUDENT (1:M)
            $sql = "SELECT * FROM firstscene";
            $sql2 = "SELECT * FROM secondscene";
            $sql3 = "SELECT * FROM thirdscene"; 
                
            $statement = $conn->prepare($sql);
            $statement->execute();
            $statement2 = $conn->prepare($sql2);
            $statement2->execute();
            $statement3 = $conn->prepare($sql3);
            $statement3->execute();
            $data = array("status" => "success", "firstscene" => $statement->fetchAll(PDO::FETCH_ASSOC), "secondscene" => $statement2->fetchAll(PDO::FETCH_ASSOC), "thirdscene" => $statement3->fetchAll(PDO::FETCH_ASSOC));

            } catch(PDOException $e) {
            $data = array("status" => "fail", "msg" => $e->getMessage());
            }
            switch($output) {
                    case "json":
                        $json =  json_encode($data);
                        echo json_encode($data, JSON_FORCE_OBJECT);
                    break;
            }
            } else {
                echo "Need a type of output!";
            }

    } else {
        echo $data;
    }
    



?>