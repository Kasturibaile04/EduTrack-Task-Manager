// Sample bookmarks data
let bookmarks = [
    {
        id: 1,
        title: "JavaScript Documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        description: "MDN Web Docs for JavaScript reference and guides",
        category: "Study"
    },
    {
        id: 2,
        title: "Project Management Tool",
        url: "https://trello.com",
        description: "Trello board for tracking project tasks",
        category: "Work"
    },
    {
        id: 3,
        title: "CSS Tricks",
        url: "https://css-tricks.com",
        description: "Helpful CSS tips and tricks",
        category: "Study"
    },
    {
        id: 4,
        title: "Personal Blog",
        url: "https://medium.com",
        description: "My personal blog for writing articles",
        category: "Personal"
    },
    {
        id: 5,
        title: "GitHub Repository",
        url: "https://github.com",
        description: "Main repository for all projects",
        category: "Work"
    },
    {
        id: 6,
        title: "Online Courses",
        url: "https://coursera.org",
        description: "Platform for online learning",
        category: "Study"
    },
    {
        id:7,
        title: "Python Documentation",
        url : "https://docs.python.org/3/",
        description : "Platform to learn python",
        category: "study"
    },
    {
        id:8,
        title: "Python Projects",
        url : "https://github.com/topics/python-projects-basic-to-advanced",
        description : "Platform to make  python projects",
        category: "study"
    },
       {
        id:9,
        title: "Graphic Design",
        url : "https://www.coursera.org/specializations/graphic-design",
        description : "Learn Graphic Design",
        category: "Tasks"
    },
    {
        id:10,
        title: "Data Science",
        url : "https://github.com/topics/data-science",
        description : "Data Science learning",
        category: "Work"
    },
   {
        id:11,
        title: "Critical Thinking",
        url : "https://youtu.be/vNDYUlxNIAA",
        description : "Make you thinking strong",
        category: "Personal"
    },
    {
        id:12,
        title: "Communication",
        url : "https://www.coursera.org/in/articles/communication-effectiveness",
        description : "make your speaking skill strong",
        category: "Personal"
    },
    {
        id:13,
        title: "UX/UI Design",
        url : "https://github.com/topics/ui-ux",
        description : "learning design",
        category: "Tasks"
    },
    {
        id:14,
        title: "Time Management",
        url : "https://www.youtube.com/watch?v=iDbdXTMnOmE",
        description : "Learn about time management",
        category: "Personal"
    },
    {
        id:15,
        title: "Genai",
        url : "https://github.blog/ai-and-ml/generative-ai/",
        description : "Learn about the AI world",
        category: "Study"
    },
    {
        id:16,
        title: "Product Manager",
        url : "https://github.com/topics/product-management",
        description : "Everthing you need to know about PM",
        category: "Work"
    },
    {
        id:17,
        title: "C++",
        url : "https://www.w3schools.com/cpp/",
        description : "learn a new programming language",
        category: "Study"
    },
    {
        id:18,
        title: "French",
        url : "https://www.thefrenchexperiment.com/",
        description : "learn French! ",
        category: "Personal"
    },
    {
        id:19,
        title: "Frontend",
        url : "https://github.com/topics/frontend",
        description : "it will teach you frontend  ",
        category: "Study"
    },
    {
        id:20,
        title: "Backend",
        url : "https://github.com/topics/backend",
        description : "it will teach you backend  ",
        category: "Study"
    },
    {
        id:21,
        title: "Web Developer",
        url : "https://web.dev/learn",
        description : "if you want to become web-dev ",
        category: "Work"
    }





    


];

// DOM Elements
const bookmarksGrid = document.getElementById('bookmarksGrid');
const searchInput = document.getElementById('searchBookmarks');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderBookmarks(bookmarks);
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Render bookmarks to the grid
function renderBookmarks(bookmarksToRender) {
    if (bookmarksToRender.length === 0) {
        bookmarksGrid.innerHTML = `
            <div class="empty-state">
                <i class="ri-bookmark-line"></i>
                <h3>No bookmarks found</h3>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }
    
    bookmarksGrid.innerHTML = bookmarksToRender.map(bookmark => `
        <div class="bookmark-card" data-category="${bookmark.category}">
            <div class="bookmark-header">
                <div>
                    <h3 class="bookmark-title">${bookmark.title}</h3>
                </div>
                <span class="bookmark-category">${bookmark.category}</span>
            </div>
            <p class="bookmark-description">${bookmark.description}</p>
            <a href="${bookmark.url}" target="_blank" class="bookmark-url">
                <i class="ri-external-link-line"></i>
                ${bookmark.url}
            </a>
            <div class="bookmark-actions">
                <button class="btn-visit" onclick="visitBookmark('${bookmark.url}')">
                    <i class="ri-external-link-line"></i> Visit
                </button>
                <button class="btn-delete" onclick="deleteBookmark(${bookmark.id})">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    let filteredBookmarks = bookmarks;
    
    // Apply search filter
    if (searchTerm) {
        filteredBookmarks = filteredBookmarks.filter(bookmark => 
            bookmark.title.toLowerCase().includes(searchTerm) ||
            bookmark.description.toLowerCase().includes(searchTerm) ||
            bookmark.url.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (activeFilter !== 'all') {
        filteredBookmarks = filteredBookmarks.filter(bookmark => 
            bookmark.category === activeFilter
        );
    }
    
    renderBookmarks(filteredBookmarks);
}

// Handle filter functionality
function handleFilter(e) {
    // Update active button
    filterButtons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');
    
    // Re-apply search and filter
    handleSearch();
}

// Visit bookmark
function visitBookmark(url) {
    window.open(url, '_blank');
}

// Delete bookmark
function deleteBookmark(id) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        handleSearch(); // Re-render with current filters
    }
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
}

// Navigation functions
function goBack() {
    window.location.href = 'dashboard.php';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // In a real app, you would clear authentication tokens here
        window.location.href = 'index.php';
    }
}

// Initialize theme on page load
checkThemePreference();