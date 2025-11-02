// planner.js - UPDATED FOR PHP+MYSQL
document.addEventListener('DOMContentLoaded', function() {
    initializePlanner();
});

function initializePlanner() {
    initializeTheme();
    initializeCurrentWeek();
    initializeModal();
    // Tasks are already loaded by PHP, just render them
    renderCalendar();
}

// All your existing functions stay the same...
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        updateThemeButton(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Week navigation (unchanged)
let currentWeekStart = new Date();

function initializeCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart = new Date(today.setDate(diff));
    updateWeekDisplay();
    renderCalendar();
}

function updateWeekDisplay() {
    const weekStart = new Date(currentWeekStart);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const weekDisplay = `Week of ${weekStart.toLocaleDateString('en-US', options)}`;
    document.getElementById('currentWeek').textContent = weekDisplay;
}

function previousWeek() {
    // Redirect to PHP with previous week parameter
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);
    window.location.href = `planner.php?week=${prevWeek.toISOString().split('T')[0]}`;
}

function nextWeek() {
    // Redirect to PHP with next week parameter
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    window.location.href = `planner.php?week=${nextWeek.toISOString().split('T')[0]}`;
}

// Calendar rendering - uses PHP-loaded data
function renderCalendar() {
    // Calendar is already rendered by PHP, just add event listeners
    addTaskEventListeners();
}

function addTaskEventListeners() {
    // Add click handlers to existing tasks (rendered by PHP)
    document.querySelectorAll('.calendar-task').forEach(task => {
        task.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            if (taskId) {
                // Redirect to edit page or show edit modal
                editTask(taskId);
            }
        });
    });
}

function showAddTaskModal() {
    // Show modal for adding new task
    document.getElementById('taskModal').style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function editTask(taskId) {
    // Redirect to edit page or populate modal
    window.location.href = `edit_task.php?id=${taskId}`;
}

// Utility functions (unchanged)
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message) {
    // Your existing notification code
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function goBack() {
    window.location.href = 'dashboard.php';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target == modal) {
        closeTaskModal();
    }
}