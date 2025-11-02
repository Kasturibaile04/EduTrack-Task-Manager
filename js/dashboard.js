// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize theme
    initializeTheme();
    
    // Initialize dropdown menu
    initializeDropdown();
    
    // Initialize modals
    initializeModals();
    
    // Initialize forms
    initializeForms();
    
    // Load tasks from database instead of sample data
    loadTasksFromDB();
    
    // Update task counts
    updateTaskCounts();
    
    // Initialize weekly calendar
    initializeCalendar();
}

// === DATABASE FUNCTIONS - ADDED ===

// Save task to database
function saveTaskToDB(task) {
    const formData = new FormData();
    formData.append('action', 'add_task');
    formData.append('title', task.title);
    formData.append('description', task.description || '');
    formData.append('due_date', task.due_date || '');
    formData.append('priority', task.priority || 'medium');
    formData.append('status', task.status || 'todo');

    fetch('config/tasks.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'success') {
            loadTasksFromDB(); // Reload tasks from database
            showNotification('Task saved successfully!');
        } else {
            alert('Failed to save task');
        }
    });
}

// Load tasks from database
function loadTasksFromDB() {
    const formData = new FormData();
    formData.append('action', 'get_tasks');
    
    fetch('config/tasks.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(tasks => {
        // Clear existing tasks
        document.getElementById('todo-tasks').innerHTML = '';
        document.getElementById('progress-tasks').innerHTML = '';
        document.getElementById('completed-tasks').innerHTML = '';
        
        // Load tasks from database
        tasks.forEach(task => {
            createTaskElement(task);
        });
        updateTaskCounts();
    })
    .catch(error => {
        console.error('Error loading tasks:', error);
        // Fallback to sample data if database fails
        loadSampleData();
    });
}

// Update task status in database
function updateTaskStatusInDB(taskId, newStatus) {
    const formData = new FormData();
    formData.append('action', 'update_task_status');
    formData.append('task_id', taskId);
    formData.append('status', newStatus);

    fetch('config/tasks.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data !== 'success') {
            console.error('Failed to update task status');
        }
    });
}

// === END DATABASE FUNCTIONS ===

// Theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.body.classList.add(savedTheme + '-theme');
    updateThemeButton(savedTheme);
    
    // Add click event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Remove current theme class
        document.body.classList.remove(currentTheme + '-theme');
        // Add new theme class
        document.body.classList.add(newTheme + '-theme');
        
        // Update button and save preference
        updateThemeButton(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
}

// Dropdown menu functionality
function initializeDropdown() {
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('show');
    });
}

// Modal functionality
function initializeModals() {
    // Task Modal
    const taskModal = document.getElementById('taskModal');
    const bookmarkModal = document.getElementById('bookmarksModal');
    const notesModal = document.getElementById('notesModal');
    const plannerModal = document.getElementById('plannerModal');
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === taskModal) closeModal();
        if (event.target === bookmarkModal) closeBookmarksModal();
        if (event.target === notesModal) closeNotesModal();
        if (event.target === plannerModal) closePlannerModal();
    });
}

// Form functionality
function initializeForms() {
    // Task Form
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask();
    });
    
    // Bookmark Form
    const bookmarkForm = document.getElementById('bookmarkForm');
    bookmarkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBookmark();
    });
    
    // Note Form
    const noteForm = document.getElementById('noteForm');
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNote();
    });
}

// Sample data for demonstration (fallback)
function loadSampleData() {
    // Sample tasks
    const sampleTasks = [
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish the project proposal document and send for review',
            priority: 'high',
            due_date: '2024-12-20',
            status: 'todo'
        },
        {
            id: 2,
            title: 'Study for exam',
            description: 'Review chapters 5-8 for the upcoming test',
            priority: 'medium',
            due_date: '2024-12-18',
            status: 'progress'
        },
        {
            id: 3,
            title: 'Buy groceries',
            description: 'Milk, eggs, bread, and vegetables',
            priority: 'low',
            due_date: '2024-12-15',
            status: 'completed'
        }
    ];
    
    // Load tasks into DOM
    sampleTasks.forEach(task => {
        createTaskElement(task);
    });
    
    updateTaskCounts();
}

// Task Management
function showAddTaskForm(status = 'todo') {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const statusSelect = document.getElementById('taskStatus');
    
    // Reset form
    form.reset();
    form.dataset.editId = '';
    
    // Set default status
    statusSelect.value = status;
    
    // Show modal
    modal.style.display = 'block';
    document.getElementById('taskTitle').focus();
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function addTask() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);
    
    const task = {
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        due_date: formData.get('due_date'),
        status: formData.get('status')
    };
    
    // Save to database instead of localStorage
    saveTaskToDB(task);
    closeModal();
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.dataset.taskId = task.id;
    
    taskElement.innerHTML = `
        <div class="task-priority priority-${task.priority}">
            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <p class="task-description">${escapeHtml(task.description)}</p>
        <div class="task-meta">
            <div class="meta-item">
                <span class="meta-label">Due Date</span>
                <span class="meta-value">${task.due_date || 'No due date'}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn" onclick="editTask(${task.id})">Edit</button>
            <button class="btn btn-bookmark" onclick="bookmarkTask(${task.id})">⭐</button>
            <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    // Add drag and drop functionality
    taskElement.draggable = true;
    taskElement.addEventListener('dragstart', handleDragStart);
    
    // Add to appropriate column
    const targetColumn = document.getElementById(`${task.status}-tasks`);
    if (targetColumn) {
        targetColumn.appendChild(taskElement);
    }
}

function updateTaskElement(task) {
    const existingTask = document.querySelector(`[data-task-id="${task.id}"]`);
    if (existingTask) {
        existingTask.remove();
    }
    createTaskElement(task);
}

function editTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    const task = {
        id: taskId,
        title: taskElement.querySelector('.task-title').textContent,
        description: taskElement.querySelector('.task-description').textContent,
        priority: taskElement.querySelector('.task-priority').className.replace('task-priority priority-', ''),
        due_date: taskElement.querySelector('.meta-value').textContent,
        status: getTaskStatus(taskElement)
    };
    
    // Populate form
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.due_date !== 'No due date' ? task.due_date : '';
    document.getElementById('taskStatus').value = task.status;
    
    // Set edit mode
    const form = document.getElementById('taskForm');
    form.dataset.editId = taskId;
    
    // Show modal
    document.getElementById('taskModal').style.display = 'block';
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
            updateTaskCounts();
            showNotification('Task deleted successfully!');
        }
    }
}

// BOOKMARK TASK FUNCTIONALITY - NEW
function bookmarkTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    const task = {
        id: taskId,
        title: taskElement.querySelector('.task-title').textContent,
        description: taskElement.querySelector('.task-description').textContent,
        priority: taskElement.querySelector('.task-priority').className.replace('task-priority priority-', ''),
        due_date: taskElement.querySelector('.meta-value').textContent,
        status: getTaskStatus(taskElement)
    };
    
    // Save to bookmarks
    saveTaskToBookmarks(task);
    showNotification('Task bookmarked successfully!');
}

function saveTaskToBookmarks(task) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    // Check if task is already bookmarked
    const existingBookmark = bookmarks.find(b => b.taskId === task.id);
    if (existingBookmark) {
        showNotification('Task already bookmarked!');
        return;
    }
    
    const bookmark = {
        id: Date.now(),
        taskId: task.id,
        title: task.title,
        url: '#', // Tasks don't have URLs, so use placeholder
        description: task.description || 'No description',
        category: 'Tasks',
        priority: task.priority,
        due_date: task.due_date,
        status: task.status,
        type: 'task', // Mark as task bookmark
        createdAt: new Date().toISOString()
    };
    
    bookmarks.unshift(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function getTaskStatus(taskElement) {
    const column = taskElement.closest('.column');
    return column ? column.dataset.status : 'todo';
}

// Drag and Drop functionality
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
    e.dataTransfer.effectAllowed = 'move';
}

// Initialize drag and drop for columns
document.addEventListener('DOMContentLoaded', function() {
    const columns = document.querySelectorAll('.tasks-container');
    
    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        column.addEventListener('drop', function(e) {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            const newStatus = this.parentElement.dataset.status;
            
            if (taskElement) {
                this.appendChild(taskElement);
                updateTaskStatusInDB(taskId, newStatus); // Update in database
                updateTaskCounts();
                showNotification(`Task moved to ${newStatus}`);
            }
        });
    });
});

// Update task counts
function updateTaskCounts() {
    const statuses = ['todo', 'progress', 'completed'];
    
    statuses.forEach(status => {
        const count = document.querySelectorAll(`#${status}-tasks .task-card`).length;
        document.getElementById(`${status}-count`).textContent = count;
    });
}

// FIXED: Navigation functionality - Added planner.html
function showFeature(feature) {
    switch(feature) {
        case 'bookmark':
            window.location.href = 'bookmark.php'; // Fixed filename
            break;
        case 'notes':
            window.location.href = 'notes.php'; // Redirect to notes page
            break;
        case 'planner':
            window.location.href = 'planner.php'; // NEW: Redirect to planner page
            break;
    }
}

function showBookmarksModal() {
    document.getElementById('bookmarksModal').style.display = 'block';
}

function closeBookmarksModal() {
    document.getElementById('bookmarksModal').style.display = 'none';
}

function showAddBookmarkForm() {
    document.getElementById('addBookmarkForm').style.display = 'block';
}

function hideAddBookmarkForm() {
    document.getElementById('addBookmarkForm').style.display = 'none';
    document.getElementById('bookmarkForm').reset();
}

function addBookmark() {
    const form = document.getElementById('bookmarkForm');
    const formData = new FormData(form);
    
    const bookmark = {
        id: Date.now(),
        title: formData.get('title'),
        url: formData.get('url'),
        description: formData.get('description'),
        category: formData.get('category')
    };
    
    createBookmarkElement(bookmark);
    hideAddBookmarkForm();
    showNotification('Bookmark added successfully!');
}

function createBookmarkElement(bookmark) {
    const bookmarksList = document.getElementById('bookmarksList');
    
    // Remove empty state if it exists
    const emptyState = bookmarksList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const bookmarkElement = document.createElement('div');
    bookmarkElement.className = 'bookmark-item';
    bookmarkElement.dataset.bookmarkId = bookmark.id;
    
    bookmarkElement.innerHTML = `
        <div class="bookmark-header">
            <a href="${escapeHtml(bookmark.url)}" target="_blank" class="bookmark-title">
                ${escapeHtml(bookmark.title)}
            </a>
            <span class="bookmark-category">${escapeHtml(bookmark.category)}</span>
        </div>
        ${bookmark.description ? `<p class="bookmark-description">${escapeHtml(bookmark.description)}</p>` : ''}
        <div class="bookmark-url">
            <small>${escapeHtml(bookmark.url)}</small>
        </div>
        <div class="bookmark-actions">
            <button class="btn" onclick="visitBookmark('${escapeHtml(bookmark.url)}')">Visit</button>
            <button class="btn btn-delete" onclick="deleteBookmark(${bookmark.id})">Delete</button>
        </div>
    `;
    
    bookmarksList.appendChild(bookmarkElement);
}

function visitBookmark(url) {
    window.open(url, '_blank');
}

function deleteBookmark(bookmarkId) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        const bookmarkElement = document.querySelector(`[data-bookmark-id="${bookmarkId}"]`);
        if (bookmarkElement) {
            bookmarkElement.remove();
            
            // Show empty state if no bookmarks left
            const bookmarksList = document.getElementById('bookmarksList');
            if (bookmarksList.children.length === 0) {
                bookmarksList.innerHTML = '<div class="empty-state"><p>No bookmarks yet. Add your first bookmark!</p></div>';
            }
            
            showNotification('Bookmark deleted successfully!');
        }
    }
}

function searchBookmarks() {
    const searchTerm = document.getElementById('bookmarkSearch').value.toLowerCase();
    const bookmarks = document.querySelectorAll('.bookmark-item');
    
    bookmarks.forEach(bookmark => {
        const title = bookmark.querySelector('.bookmark-title').textContent.toLowerCase();
        const description = bookmark.querySelector('.bookmark-description')?.textContent.toLowerCase() || '';
        const category = bookmark.querySelector('.bookmark-category').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm);
        bookmark.style.display = matches ? 'block' : 'none';
    });
}

// Notes functionality
function showNotesModal() {
    document.getElementById('notesModal').style.display = 'block';
}

function closeNotesModal() {
    document.getElementById('notesModal').style.display = 'none';
}

function showAddNoteForm() {
    document.getElementById('addNoteForm').style.display = 'block';
}

function hideAddNoteForm() {
    document.getElementById('addNoteForm').style.display = 'none';
    document.getElementById('noteForm').reset();
}

function addNote() {
    const form = document.getElementById('noteForm');
    const formData = new FormData(form);
    
    const note = {
        id: Date.now(),
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category')
    };
    
    createNoteElement(note);
    hideAddNoteForm();
    showNotification('Note added successfully!');
}

function createNoteElement(note) {
    const notesList = document.getElementById('notesList');
    
    // Remove empty state if it exists
    const emptyState = notesList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    noteElement.dataset.noteId = note.id;
    
    noteElement.innerHTML = `
        <div class="note-header">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <span class="note-category">${escapeHtml(note.category)}</span>
        </div>
        <div class="note-content">${escapeHtml(note.content)}</div>
        <div class="note-actions">
            <button class="btn" onclick="editNote(${note.id})">Edit</button>
            <button class="btn btn-delete" onclick="deleteNote(${note.id})">Delete</button>
        </div>
    `;
    
    notesList.appendChild(noteElement);
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            noteElement.remove();
            
            // Show empty state if no notes left
            const notesList = document.getElementById('notesList');
            if (notesList.children.length === 0) {
                notesList.innerHTML = '<div class="empty-state"><p>No notes yet. Add your first note!</p></div>';
            }
            
            showNotification('Note deleted successfully!');
        }
    }
}

function searchNotes() {
    const searchTerm = document.getElementById('noteSearch').value.toLowerCase();
    const notes = document.querySelectorAll('.note-item');
    
    notes.forEach(note => {
        const title = note.querySelector('.note-title').textContent.toLowerCase();
        const content = note.querySelector('.note-content').textContent.toLowerCase();
        const category = note.querySelector('.note-category').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm);
        note.style.display = matches ? 'block' : 'none';
    });
}

// Weekly Planner functionality - Updated to redirect
function showPlannerModal() {
    // Instead of showing modal, redirect to planner.html
    window.location.href = 'planner.php';
}

function closePlannerModal() {
    document.getElementById('plannerModal').style.display = 'none';
}

function initializeCalendar() {
    generateTimeSlots();
}

function generateTimeSlots() {
    const calendarBody = document.getElementById('calendarBody');
    calendarBody.innerHTML = '';
    
    // Generate time slots from 6 AM to 10 PM
    for (let hour = 6; hour <= 22; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'calendar-row';
        
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-slot';
        timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
        
        timeSlot.appendChild(timeLabel);
        
        // Create day columns
        for (let day = 0; day < 7; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.dataset.time = `${hour.toString().padStart(2, '0')}:00`;
            dayCell.dataset.day = day;
            
            dayCell.addEventListener('click', function() {
                showAddEventForm(this);
            });
            
            timeSlot.appendChild(dayCell);
        }
        
        calendarBody.appendChild(timeSlot);
    }
}

function showAddEventForm(cell = null) {
    // Simple implementation - you can expand this
    const title = prompt('Enter event title:');
    if (title) {
        showNotification(`Event "${title}" added to calendar!`);
    }
}

function previousWeek() {
    showNotification('Previous week');
}

function nextWeek() {
    showNotification('Next week');
}

// Utility functions
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
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
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'config/auth.php?action=logout';
    }
}