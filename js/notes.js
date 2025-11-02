// Notes functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNotes();
});

function initializeNotes() {
    // Initialize theme
    initializeTheme();
    
    // Initialize forms
    initializeForms();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load notes from localStorage
    loadNotes();
    
    // Update stats
    updateStats();
}

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
}

// Form functionality
function initializeForms() {
    const noteForm = document.getElementById('noteForm');
    noteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveNote();
    });
}

// Event listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchNotes');
    searchInput.addEventListener('input', function() {
        filterNotes();
    });
    
    // Subject filter
    const subjectButtons = document.querySelectorAll('.subject-btn');
    subjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            subjectButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter notes
            filterNotes();
        });
    });
    
    // Close modal when clicking outside
    const modal = document.getElementById('noteModal');
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeNoteModal();
        }
    });
}

// Note management
let notes = [];
let editingNoteId = null;

function loadNotes() {
    // Load notes from localStorage or use sample data
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    } else {
        // Sample notes
        notes = [
            {
                id: 1,
                title: 'Algebra Basics',
                subject: 'mathematics',
                content: 'Algebra is the branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'World War II Timeline',
                subject: 'history',
                content: 'World War II lasted from 1939 to 1945 and involved most of the world\'s nations. Key events include the invasion of Poland, Pearl Harbor, D-Day, and the atomic bombings.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                title: 'JavaScript Functions',
                subject: 'programming',
                content: 'Functions are one of the fundamental building blocks in JavaScript. A function is a set of statements that performs a task or calculates a value.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        saveNotes();
    }
    
    renderNotes();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
    const notesGrid = document.getElementById('notesGrid');
    const filteredNotes = getFilteredNotes();
    
    if (filteredNotes.length === 0) {
        notesGrid.innerHTML = `
            <div class="empty-state">
                <h3>No notes found</h3>
                <p>Create your first note to get started!</p>
            </div>
        `;
        return;
    }
    
    notesGrid.innerHTML = filteredNotes.map(note => `
        <div class="note-card" data-note-id="${note.id}">
            <div class="note-header">
                <div>
                    <h3 class="note-title">${escapeHtml(note.title)}</h3>
                    <span class="note-subject">${getSubjectDisplayName(note.subject)}</span>
                </div>
            </div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-meta">
                <span>${formatDate(note.updatedAt)}</span>
            </div>
            <div class="note-actions">
                <button class="btn" onclick="viewNote(${note.id})">View</button>
                <button class="btn" onclick="editNote(${note.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function getFilteredNotes() {
    const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
    const activeSubject = document.querySelector('.subject-btn.active').dataset.subject;
    
    return notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm) || 
                             note.content.toLowerCase().includes(searchTerm);
        const matchesSubject = activeSubject === 'all' || note.subject === activeSubject;
        
        return matchesSearch && matchesSubject;
    });
}

function filterNotes() {
    renderNotes();
    updateStats();
}

function updateStats() {
    const filteredNotes = getFilteredNotes();
    const uniqueSubjects = new Set(filteredNotes.map(note => note.subject));
    
    document.getElementById('total-notes').textContent = filteredNotes.length;
    document.getElementById('total-subjects').textContent = uniqueSubjects.size;
}

// Note CRUD operations
function showNoteModal() {
    editingNoteId = null;
    document.getElementById('modalTitle').textContent = 'New Note';
    document.getElementById('noteForm').reset();
    document.getElementById('noteModal').style.display = 'block';
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
    editingNoteId = null;
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value;
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const now = new Date().toISOString();
    
    if (editingNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                subject,
                content,
                updatedAt: now
            };
        }
    } else {
        // Create new note
        const newNote = {
            id: Date.now(),
            title,
            subject,
            content,
            createdAt: now,
            updatedAt: now
        };
        notes.unshift(newNote);
    }
    
    saveNotes();
    renderNotes();
    updateStats();
    closeNoteModal();
    showNotification('Note saved successfully!');
}

function viewNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const preview = document.getElementById('notePreview');
    preview.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <div>
                    <h2 class="preview-title">${escapeHtml(note.title)}</h2>
                    <span class="preview-subject">${getSubjectDisplayName(note.subject)}</span>
                </div>
            </div>
            <div class="preview-body">${escapeHtml(note.content)}</div>
            <div class="preview-actions">
                <button class="btn" onclick="editNote(${note.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        </div>
    `;
    
    // Highlight the selected note card
    document.querySelectorAll('.note-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-note-id="${noteId}"]`).classList.add('active');
}

function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    editingNoteId = noteId;
    document.getElementById('modalTitle').textContent = 'Edit Note';
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteSubject').value = note.subject;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteModal').style.display = 'block';
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== noteId);
        saveNotes();
        renderNotes();
        updateStats();
        
        // Clear preview if deleted note was being viewed
        const preview = document.getElementById('notePreview');
        if (preview.querySelector('.preview-content')) {
            preview.innerHTML = `
                <div class="preview-placeholder">
                    <h3>Select a note to view</h3>
                    <p>Choose a note from the list to read or edit it</p>
                </div>
            `;
        }
        
        showNotification('Note deleted successfully!');
    }
}

// Utility functions
function getSubjectDisplayName(subject) {
    const subjectMap = {
        'mathematics': 'Mathematics',
        'history': 'History',
        'science': 'Science',
        'programming': 'Programming',
        'literature': 'Literature',
        'other': 'Other'
    };
    return subjectMap[subject] || subject;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

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
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.php';
    }
}