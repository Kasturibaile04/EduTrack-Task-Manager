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
    <title>Notes - EduTrack</title>
    <link rel="stylesheet" href="css/notes.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet"/>
</head>
<body class="light-theme">
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <h2><a href="dashboard.php" style="text-decoration: none; color: inherit;">📝 Notes</a></h2>
            </div>
            <div class="nav-actions">
                <button class="theme-toggle" id="themeToggle">🌙</button>
                <button class="new-note-btn" onclick="showNoteModal()">+ New Note</button>
                <button class="logout-btn-nav" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
    </nav>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Organize your study notes by subject</h1>
            <div class="search-bar">
                <input type="text" id="searchNotes" placeholder="Search notes...">
            </div>
        </div>

        <div class="notes-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-section">
                    <h3>All Subjects</h3>
                    <div class="subject-list">
                        <button class="subject-btn active" data-subject="all">All Notes</button>
                        <button class="subject-btn" data-subject="mathematics">Mathematics</button>
                        <button class="subject-btn" data-subject="history">History</button>
                        <button class="subject-btn" data-subject="science">Science</button>
                        <button class="subject-btn" data-subject="programming">Programming</button>
                        <button class="subject-btn" data-subject="literature">Literature</button>
                    </div>
                </div>
                <div class="sidebar-stats">
                    <div class="stat">
                        <span class="stat-number" id="total-notes">0</span>
                        <span class="stat-label">Total Notes</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number" id="total-subjects">0</span>
                        <span class="stat-label">Subjects</span>
                    </div>
                </div>
            </div>

            <!-- Notes Grid -->
            <div class="notes-grid" id="notesGrid">
                <!-- Notes will be dynamically added here -->
            </div>

            <!-- Note Preview -->
            <div class="note-preview" id="notePreview">
                <div class="preview-placeholder">
                    <h3>Select a note to view</h3>
                    <p>Choose a note from the list to read or edit it</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Note Modal -->
    <div id="noteModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeNoteModal()">&times;</span>
            <h2 id="modalTitle">New Note</h2>
            <form id="noteForm">
                <div class="form-group">
                    <label for="noteTitle">Title *</label>
                    <input type="text" id="noteTitle" required>
                </div>
                <div class="form-group">
                    <label for="noteSubject">Subject</label>
                    <select id="noteSubject">
                        <option value="mathematics">Mathematics</option>
                        <option value="history">History</option>
                        <option value="science">Science</option>
                        <option value="programming">Programming</option>
                        <option value="literature">Literature</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="noteContent">Content *</label>
                    <textarea id="noteContent" rows="10" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeNoteModal()">Cancel</button>
                    <button type="submit" id="saveNoteBtn">Save Note</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/notes.js"></script>
    <script>
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'config/auth.php?action=logout';
        }
    }
    </script>
</body>
</html>