<?php
// Remove session_start() from here - it's already in auth.php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edutrack_db";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbname,$port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>