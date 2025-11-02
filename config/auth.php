<?php
session_start();
include 'config.php';

// Check if it's a POST request and action exists
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    
    if ($action === 'signup') {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        if (strlen($password) < 6) {
            echo "short_password";
            exit;
        }
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $email, $email, $hashed_password, $name, $name);
        
        if ($stmt->execute()) {
            $_SESSION['user_id'] = $stmt->insert_id;
            $_SESSION['username'] = $email;
            echo "success";
        } else {
            echo "error";
        }
        exit;
    }
    
    if ($action === 'login') {
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        if (strlen($password) < 6) {
            echo "short_password";
            exit;
        }
        
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $email;
            echo "success";
        } else {
            echo "not_found";
        }
        exit;
    }
}

// Check if it's a GET request for logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: ../login.php");
    exit();
}

// If no valid action, just exit
exit;
?>