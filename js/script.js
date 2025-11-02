// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.php') || currentPage === '/' || currentPage.includes('/index.html')) {
        initializeIndexPage();
    } else if (currentPage.includes('dashboard.php')) {
        initializeDashboard();
    } else if (currentPage.includes('login.php')) {
        initializeLoginPage();
    } else if (currentPage.includes('signup.php')) {
        initializeSignupPage();
    }
});

// INDEX PAGE FUNCTIONALITY
function initializeIndexPage() {
    console.log('Initializing index page...');
    
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const getStartedBtn = document.getElementById('get-started-btn');
    const tryFreeBtn = document.getElementById('try-free-btn');
    const signinBtn = document.getElementById('signin-btn');
    
    // Login buttons → login.html
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.php';
        });
    }
    if (signinBtn) {
        signinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.php';
        });
    }

    // Signup buttons → signup.html
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.php';
        });
    }
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.php';
        });
    }
    if (tryFreeBtn) {
        tryFreeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.php';
        });
    }

    initSmoothScroll();
}

// LOGIN PAGE FUNCTIONALITY
function initializeLoginPage() {
    console.log("Login page loaded");

    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user && user.email === email && user.password === password) {
            alert("Login successful! Redirecting to dashboard...");
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                window.location.href = 'dashboard.php';
            }, 1000);
        } else {
            alert("Invalid email or password!");
        }
    });
}

// SIGNUP PAGE FUNCTIONALITY
function initializeSignupPage() {
    console.log("Signup page loaded");

    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email && password) {
            localStorage.setItem('user', JSON.stringify({ email, password }));
            alert("Signup successful! Redirecting to login...");
            setTimeout(() => {
                window.location.href = 'login.php';
            }, 1000);
        } else {
            alert("Please fill all fields!");
        }
    });
}
