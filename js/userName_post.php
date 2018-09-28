<?php
    // $connection = mysqli_connect('localhost', 'root', '', '2910project');
    $connection = mysqli_connect('localhost', 'ticom_root', 'password', 'ticom_COMP2910');

    if($_POST['done']){
        $userName = $_POST['playerName'];
        $miniGame1 = $_POST['miniGame1'];
        $miniGame2 = $_POST['miniGame2'];
        $miniGame3 = $_POST['miniGame3'];

        $q = "INSERT INTO user VALUES ('{$userName}', '{$miniGame1}', '{$miniGame2}', '{$miniGame3}')";
        $query = mysqli_query($connection, $q);
        if($query){
            echo 'data inserted successfully';
        }
    }
?>