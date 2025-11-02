<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit();
}

// Connect to database
$connection = mysqli_connect("localhost", "root", "", "edutrack_db");

if (isset($_GET['id'])) {
    $task_id = $_GET['id'];
    $user_id = $_SESSION['user_id'];
    
    // Delete only if the task belongs to the logged-in user
    $sql = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    $stmt = mysqli_prepare($connection, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $task_id, $user_id);
    mysqli_stmt_execute($stmt);
}

// Redirect back to dashboard
header("Location: ../dashboard.php");
exit();
?>