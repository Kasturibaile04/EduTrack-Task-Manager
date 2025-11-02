<?php
session_start();
// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bookmarks - EduTrack</title>
    <link rel="stylesheet" href="css/bookmark.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet"/>
</head>
<body class="light-theme">
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <h2><a href="dashboard.php" style="text-decoration: none; color: inherit;">🔖 BrainBoost</a></h2>
            </div>
            <div class="nav-actions">
                <button class="theme-toggle" id="themeToggle">🌙</button>
                <button class="back-btn" onclick="goBack()">← Back to Dashboard</button>
                <button class="logout-btn-nav" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
    </nav>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Your Saved Stacks </h1>
            <p>Quick access to your important links and resources</p>
            <div class="header-actions">
                <div class="search-bar">
                    <input type="text" id="searchBookmarks" placeholder="Search books...">
                    <i class="ri-search-line"></i>
                </div>
            </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <button class="filter-btn active" data-filter="all">All Books</button>
            <button class="filter-btn" data-filter="Tasks">Tasks</button>
            <button class="filter-btn" data-filter="Study">Study</button>
            <button class="filter-btn" data-filter="Work">Work</button>
            <button class="filter-btn" data-filter="Personal">Personal</button>
        </div>

        <!-- Bookmarks Grid -->
        <div class="bookmarks-grid" id="bookmarksGrid">
            <!-- Bookmarks will be loaded dynamically -->
        </div>
    </div>

    <script src="js/bookmark.js"></script>
    <script>
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'config/auth.php?action=logout';
        }
    }
    
    function goBack() {
        window.location.href = 'dashboard.php';
    }
    </script>
</body>
</html>