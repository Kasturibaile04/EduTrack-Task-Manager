<?php
session_start();
// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Connect to database
$connection = mysqli_connect("localhost", "root", "", "edutrack_db");

// Check connection
if (!$connection) {
    // Continue anyway - don't break the page
}

// Get tasks from database for the logged-in user
$tasks = array();
if ($connection) {
    $user_id = $_SESSION['user_id'];
    $sql = "SELECT * FROM tasks WHERE user_id = '$user_id'";
    $result = mysqli_query($connection, $sql);
    
    if ($result) {
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduTrack - Dashboard</title>
    <link rel="stylesheet" href="css/dashboard.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet"/>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <h2>EduTrack - Welcome <?php echo isset($_SESSION['username']) ? $_SESSION['username'] : 'User'; ?>!</h2>
            </div>
            <div class="nav-actions">
                <button class="add-task-btn" onclick="showAddTaskForm('todo')">+ New Task</button>
                
                <button class="theme-toggle" id="themeToggle">🌙</button>
                
                <!-- Logout Button in Navbar -->
                <button class="logout-btn-nav" onclick="logout()">🚪 Logout</button>
                
                <div class="dropdown">
                    <button class="menu-btn" id="menuBtn">☰</button>
                    <div class="dropdown-menu" id="dropdownMenu">
                        <button class="menu-item" onclick="showFeature('notes')">📝 Notes</button>
                        <button class="menu-item" onclick="showFeature('bookmark')">🔖 Learn</button>
                        <button class="menu-item" onclick="showFeature('planner')">📅 Weekly Planner</button>
                        <!-- Logout Button in Menu -->
                        <button class="menu-item logout-btn" onclick="logout()">🚪 Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="header">
            <h1>Organize your workflow and boost productivity</h1>
        </div>

        <!-- Columns -->
        <div class="columns">
            <!-- To Do Column -->
            <div class="column" data-status="todo">
                <div class="column-header">
                    <div class="column-title">To Do</div>
                    <div class="column-stats">
                        <span class="stat-number" id="todo-count">0</span>
                        <span class="column-subtitle">tasks</span>
                    </div>
                </div>
                <div class="tasks-container" id="todo-tasks">
                    <!-- Tasks will be added here dynamically -->
                    <?php
                    // Add tasks from database to To Do column
                    foreach ($tasks as $task) {
                        if ($task['status'] == 'todo') {
                            echo '<div class="task-card" data-task-id="' . $task['id'] . '">';
                            echo '<div class="task-header">';
                            echo '<h3 class="task-title">' . htmlspecialchars($task['title']) . '</h3>';
                            echo '<span class="task-priority ' . strtolower($task['priority']) . '">' . $task['priority'] . '</span>';
                            echo '</div>';
                            if (!empty($task['description'])) {
                                echo '<p class="task-description">' . htmlspecialchars($task['description']) . '</p>';
                            }
                            if (!empty($task['due_date']) && $task['due_date'] != '0000-00-00') {
                                echo '<div class="task-due-date">📅 ' . $task['due_date'] . '</div>';
                            }
                            echo '<div class="task-actions">';
                            echo '<button class="btn-move" onclick="moveTask(' . $task['id'] . ', \'progress\')">→ Progress</button>';
                            echo '<button class="btn-delete" onclick="deleteTask(' . $task['id'] . ')">Delete</button>';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>
            </div>

            <!-- In Progress Column -->
            <div class="column" data-status="progress">
                <div class="column-header">
                    <div class="column-title">In Progress</div>
                    <div class="column-stats">
                        <span class="stat-number" id="progress-count">0</span>
                        <span class="column-subtitle">tasks</span>
                    </div>
                </div>
                <div class="tasks-container" id="progress-tasks">
                    <!-- Tasks will be added here dynamically -->
                    <?php
                    // Add tasks from database to In Progress column
                    foreach ($tasks as $task) {
                        if ($task['status'] == 'progress') {
                            echo '<div class="task-card" data-task-id="' . $task['id'] . '">';
                            echo '<div class="task-header">';
                            echo '<h3 class="task-title">' . htmlspecialchars($task['title']) . '</h3>';
                            echo '<span class="task-priority ' . strtolower($task['priority']) . '">' . $task['priority'] . '</span>';
                            echo '</div>';
                            if (!empty($task['description'])) {
                                echo '<p class="task-description">' . htmlspecialchars($task['description']) . '</p>';
                            }
                            if (!empty($task['due_date']) && $task['due_date'] != '0000-00-00') {
                                echo '<div class="task-due-date">📅 ' . $task['due_date'] . '</div>';
                            }
                            echo '<div class="task-actions">';
                            echo '<button class="btn-move" onclick="moveTask(' . $task['id'] . ', \'todo\')">← To Do</button>';
                            echo '<button class="btn-move" onclick="moveTask(' . $task['id'] . ', \'completed\')">Completed →</button>';
                            echo '<button class="btn-delete" onclick="deleteTask(' . $task['id'] . ')">Delete</button>';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>
            </div>

            <!-- Completed Column -->
            <div class="column" data-status="completed">
                <div class="column-header">
                    <div class="column-title">Completed</div>
                    <div class="column-stats">
                        <span class="stat-number" id="completed-count">0</span>
                        <span class="column-subtitle">tasks</span>
                    </div>
                </div>
                <div class="tasks-container" id="completed-tasks">
                    <!-- Tasks will be added here dynamically -->
                    <?php
                    // Add tasks from database to Completed column
                    foreach ($tasks as $task) {
                        if ($task['status'] == 'completed') {
                            echo '<div class="task-card" data-task-id="' . $task['id'] . '">';
                            echo '<div class="task-header">';
                            echo '<h3 class="task-title">' . htmlspecialchars($task['title']) . '</h3>';
                            echo '<span class="task-priority ' . strtolower($task['priority']) . '">' . $task['priority'] . '</span>';
                            echo '</div>';
                            if (!empty($task['description'])) {
                                echo '<p class="task-description">' . htmlspecialchars($task['description']) . '</p>';
                            }
                            if (!empty($task['due_date']) && $task['due_date'] != '0000-00-00') {
                                echo '<div class="task-due-date">📅 ' . $task['due_date'] . '</div>';
                            }
                            echo '<div class="task-actions">';
                            echo '<button class="btn-move" onclick="moveTask(' . $task['id'] . ', \'progress\')">← Progress</button>';
                            echo '<button class="btn-delete" onclick="deleteTask(' . $task['id'] . ')">Delete</button>';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Task Modal -->
    <div id="taskModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Add New Task</h2>
            <form id="taskForm" action="config/add_task.php" method="POST">
                <div class="form-group">
                    <label for="taskTitle">Title *</label>
                    <input type="text" id="taskTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="taskDescription">Description</label>
                    <textarea id="taskDescription" name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="taskPriority">Priority</label>
                    <select id="taskPriority" name="priority">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskDueDate">Due Date</label>
                    <input type="date" id="taskDueDate" name="due_date">
                </div>
                <div class="form-group">
                    <label for="taskStatus">Status</label>
                    <select id="taskStatus" name="status">
                        <option value="todo">To Do</option>
                        <option value="progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="add-task-btn">➕ Add Task</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Bookmarks Modal -->
    <div id="bookmarksModal" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="closeBookmarksModal()">&times;</span>
            <h2>🔖 My Bookmarks</h2>
            
            <div class="bookmarks-header">
                <button class="add-bookmark-btn" onclick="showAddBookmarkForm()">+ Add Bookmark</button>
                <div class="search-box">
                    <input type="text" id="bookmarkSearch" placeholder="Search bookmarks..." onkeyup="searchBookmarks()">
                </div>
            </div>
            
            <!-- Add Bookmark Form -->
            <div id="addBookmarkForm" class="add-bookmark-form" style="display: none;">
                <h3>Add New Bookmark</h3>
                <form id="bookmarkForm">
                    <div class="form-group">
                        <label for="bookmarkTitle">Title *</label>
                        <input type="text" id="bookmarkTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="bookmarkUrl">URL *</label>
                        <input type="url" id="bookmarkUrl" name="url" required placeholder="https://">
                    </div>
                    <div class="form-group">
                        <label for="bookmarkDescription">Description</label>
                        <textarea id="bookmarkDescription" name="description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="bookmarkCategory">Category</label>
                        <select id="bookmarkCategory" name="category">
                            <option value="General">General</option>
                            <option value="Study">Study</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Resources">Resources</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="hideAddBookmarkForm()">Cancel</button>
                        <button type="submit" class="add-bookmark-btn">➕ Add Bookmark</button>
                    </div>
                </form>
            </div>
            
            <!-- Bookmarks List -->
            <div id="bookmarksList" class="bookmarks-list">
                <div class="empty-state">
                    <p>No bookmarks yet. Add your first bookmark!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Notes Modal -->
    <div id="notesModal" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="closeNotesModal()">&times;</span>
            <h2>📝 My Notes</h2>
            
            <div class="notes-header">
                <button class="add-note-btn" onclick="showAddNoteForm()">+ Add Note</button>
                <div class="search-box">
                    <input type="text" id="noteSearch" placeholder="Search notes..." onkeyup="searchNotes()">
                </div>
            </div>
            
            <!-- Add Note Form -->
            <div id="addNoteForm" class="add-note-form" style="display: none;">
                <h3>Add New Note</h3>
                <form id="noteForm">
                    <div class="form-group">
                        <label for="noteTitle">Title *</label>
                        <input type="text" id="noteTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="noteContent">Content *</label>
                        <textarea id="noteContent" name="content" rows="6" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="noteCategory">Category</label>
                        <select id="noteCategory" name="category">
                            <option value="General">General</option>
                            <option value="Study">Study</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Ideas">Ideas</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="hideAddNoteForm()">Cancel</button>
                        <button type="submit" class="add-note-btn">➕ Add Note</button>
                    </div>
                </form>
            </div>
            
            <!-- Notes List -->
            <div id="notesList" class="notes-list">
                <div class="empty-state">
                    <p>No notes yet. Add your first note!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Weekly Planner Modal -->
    <div id="plannerModal" class="modal">
        <div class="modal-content" style="max-width: 1000px;">
            <span class="close" onclick="closePlannerModal()">&times;</span>
            <h2>📅 Weekly Planner</h2>
            
            <div class="planner-header">
                <button class="add-event-btn" onclick="showAddEventForm()">+ Add Event</button>
                <div class="week-navigation">
                    <button class="nav-btn" onclick="previousWeek()">← Previous</button>
                    <span id="currentWeek" class="week-display">This Week</span>
                    <button class="nav-btn" onclick="nextWeek()">Next →</button>
                </div>
            </div>
            
            <!-- Weekly Calendar -->
            <div class="weekly-calendar">
                <div class="calendar-header">
                    <div class="time-column">Time</div>
                    <div class="day-column">Monday</div>
                    <div class="day-column">Tuesday</div>
                    <div class="day-column">Wednesday</div>
                    <div class="day-column">Thursday</div>
                    <div class="day-column">Friday</div>
                    <div class="day-column">Saturday</div>
                    <div class="day-column">Sunday</div>
                </div>
                <div class="calendar-body" id="calendarBody">
                    <!-- Calendar time slots will be generated here -->
                </div>
            </div>
        </div>
    </div>

    <script src="js/dashboard.js"></script>
    <script>
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'config/auth.php?action=logout';
        }
    }

    // Task functions
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            window.location.href = 'config/delete_task.php?id=' + taskId;
        }
    }

    function moveTask(taskId, newStatus) {
        window.location.href = 'config/move_task.php?id=' + taskId + '&status=' + newStatus;
    }

    // Update task counts on page load
    document.addEventListener('DOMContentLoaded', function() {
        const todoCount = document.querySelectorAll('#todo-tasks .task-card').length;
        const progressCount = document.querySelectorAll('#progress-tasks .task-card').length;
        const completedCount = document.querySelectorAll('#completed-tasks .task-card').length;
        
        document.getElementById('todo-count').textContent = todoCount;
        document.getElementById('progress-count').textContent = progressCount;
        document.getElementById('completed-count').textContent = completedCount;
    });
    </script>
</body>
</html>