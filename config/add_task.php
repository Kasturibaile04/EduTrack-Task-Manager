<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit();
}

// Connect to database
$connection = mysqli_connect("localhost", "root", "", "edutrack_db");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $due_date = $_POST['due_date'];
    $priority = $_POST['priority'];
    $status = $_POST['status'];
    $task_time = isset($_POST['task_time']) ? $_POST['task_time'] : '';
    
    // Save to PLANNER table instead of tasks table
    $sql = "INSERT INTO planner (user_id, title, description, due_date, priority, task_time, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = mysqli_prepare($connection, $sql);
    mysqli_stmt_bind_param($stmt, "issssss", $user_id, $title, $description, $due_date, $priority, $task_time, $status);
    mysqli_stmt_execute($stmt);
}

// Redirect back to PLANNER (not dashboard)
header("Location: ../dashboard.php");
exit();
?>