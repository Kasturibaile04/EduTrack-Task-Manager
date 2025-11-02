<?php
session_start();
require_once 'config/config.php';

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_task'])) {
        // Add new task to database
        $title = $_POST['title'];
        $description = $_POST['description'] ?? '';
        $priority = $_POST['priority'] ?? 'medium';
        $due_date = $_POST['due_date'];
        $task_time = $_POST['task_time'] ?? '';
        
        $stmt = $conn->prepare("INSERT INTO planner (user_id, title, description, priority, due_date, task_time, status) VALUES (?, ?, ?, ?, ?, ?, 'scheduled')");
        $stmt->bind_param("isssss", $user_id, $title, $description, $priority, $due_date, $task_time);
        
        if ($stmt->execute()) {
            $success_message = "Task added successfully!";
        } else {
            $error_message = "Error adding task!";
        }
        
        // Refresh to show the new task
        header("Location: planner.php");
        exit();
    }
    
    if (isset($_POST['delete_task'])) {
        // Delete task from database
        $task_id = $_POST['task_id'];
        $stmt = $conn->prepare("DELETE FROM planner WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        $stmt->execute();
        
        header("Location: planner.php");
        exit();
    }
}

// Get current week
$current_week = isset($_GET['week']) ? $_GET['week'] : date('Y-m-d');
$week_start = date('Y-m-d', strtotime('monday this week', strtotime($current_week)));
$week_end = date('Y-m-d', strtotime('sunday this week', strtotime($current_week)));

// Get tasks for the current week from database
$stmt = $conn->prepare("SELECT * FROM planner WHERE user_id = ? AND due_date BETWEEN ? AND ? ORDER BY due_date, task_time");
$stmt->bind_param("iss", $user_id, $week_start, $week_end);
$stmt->execute();
$tasks_result = $stmt->get_result();
$tasks = [];
while ($row = $tasks_result->fetch_assoc()) {
    $tasks[] = $row;
}

// Get statistics from database
$stats_stmt = $conn->prepare("SELECT 
    COUNT(*) as total_tasks,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
    FROM planner WHERE user_id = ?");
$stats_stmt->bind_param("i", $user_id);
$stats_stmt->execute();
$stats = $stats_stmt->get_result()->fetch_assoc();

// Calculate statistics for JavaScript
$total_tasks = $stats['total_tasks'] ?? 0;
$completed_tasks = $stats['completed_tasks'] ?? 0;
$pending_tasks = $total_tasks - $completed_tasks;
$productivity_score = $total_tasks > 0 ? round(($completed_tasks / $total_tasks) * 100) : 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Planner - Task Manager</title>
    <link rel="stylesheet" href="css/planner.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <h2><a href="dashboard.php" style="text-decoration: none; color: inherit;">📅 Weekly Planner</a></h2>
            </div>
            <div class="nav-actions">
                <button class="theme-toggle" id="themeToggle">🌙</button>
                <button class="add-task-btn" onclick="showAddTaskModal()">+ Add Task</button>
                <button class="back-btn" onclick="goBack()">← Dashboard</button>
                <button class="logout-btn-nav" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
    </nav>

    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Your Weekly Planner</h1>
            <p>Plan your week and stay organized</p>
            <div class="week-navigation">
                <a href="planner.php?week=<?php echo date('Y-m-d', strtotime($week_start . ' -7 days')); ?>" class="nav-btn">← Previous</a>
                <h2 id="currentWeek">Week of <?php echo date('M j, Y', strtotime($week_start)); ?></h2>
                <a href="planner.php?week=<?php echo date('Y-m-d', strtotime($week_start . ' +7 days')); ?>" class="nav-btn">Next →</a>
            </div>
        </div>

        <!-- Weekly Calendar -->
        <div class="weekly-calendar">
            <div class="calendar-header">
                <div class="day-header">Monday</div>
                <div class="day-header">Tuesday</div>
                <div class="day-header">Wednesday</div>
                <div class="day-header">Thursday</div>
                <div class="day-header">Friday</div>
                <div class="day-header">Saturday</div>
                <div class="day-header">Sunday</div>
            </div>
            <div class="calendar-body" id="calendarBody">
                <?php
                // Generate calendar days for the week
                $current_day = $week_start;
                for ($i = 0; $i < 7; $i++) {
                    $day_tasks = array_filter($tasks, function($task) use ($current_day) {
                        return $task['due_date'] == $current_day;
                    });
                    ?>
                    <div class="calendar-day" data-date="<?php echo $current_day; ?>">
                        <div class="day-number"><?php echo date('j', strtotime($current_day)); ?></div>
                        <div class="day-tasks">
                            <?php foreach ($day_tasks as $task): ?>
                                <div class="calendar-task <?php echo $task['priority']; ?>-priority">
                                    <!-- ONLY SHOW TASK TITLE -->
                                    <div class="task-title"><?php echo htmlspecialchars($task['title']); ?></div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php
                    $current_day = date('Y-m-d', strtotime($current_day . ' +1 day'));
                }
                ?>
            </div>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-number" id="totalTasks"><?php echo $total_tasks; ?></div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="completedTasks"><?php echo $completed_tasks; ?></div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="pendingTasks"><?php echo $pending_tasks; ?></div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="productivityScore"><?php echo $productivity_score; ?>%</div>
                <div class="stat-label">Productivity</div>
            </div>
        </div>
    </div>

    <!-- Add Task Modal -->
    <div id="taskModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeTaskModal()">&times;</span>
            <h2>Add Task to Planner</h2>
            <form id="taskForm" method="POST">
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
                    <input type="date" id="taskDueDate" name="due_date" value="<?php echo date('Y-m-d'); ?>" required>
                </div>
                <div class="form-group">
                    <label for="taskTime">Time</label>
                    <input type="time" id="taskTime" name="task_time">
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeTaskModal()">Cancel</button>
                    <button type="submit" name="add_task">Add to Planner</button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/planner.js"></script>
    <script>
    // Pass PHP data to JavaScript
    const phpStats = {
        totalTasks: <?php echo $total_tasks; ?>,
        completedTasks: <?php echo $completed_tasks; ?>,
        pendingTasks: <?php echo $pending_tasks; ?>,
        productivityScore: <?php echo $productivity_score; ?>
    };

    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'config/auth.php?action=logout';
        }
    }
    
    function goBack() {
        window.location.href = 'dashboard.php';
    }

    // Show notification if there's a PHP message
    <?php if (isset($success_message)): ?>
        alert('<?php echo $success_message; ?>');
    <?php endif; ?>
    <?php if (isset($error_message)): ?>
        alert('<?php echo $error_message; ?>');
    <?php endif; ?>
    </script>
</body>
</html>