<?php
session_start();
// If user is already logged in, redirect to dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Signup - EduTrack</title>
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif;}
body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f2f5;}
.container{background:#fff;padding:40px 30px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1);width:100%;max-width:400px;}
h2{text-align:center;margin-bottom:10px;color:#1f2937;}
p.subtitle{text-align:center;font-size:0.9rem;color:#6b7280;margin-bottom:30px;}
.form-group{margin-bottom:20px;}
.form-group input{width:100%;padding:12px 15px;border:1.5px solid #d1d5db;border-radius:8px;font-size:1rem;transition:all 0.3s ease;}
.form-group input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2);outline:none;}
.password-toggle{position:absolute;right:15px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.1rem;}
.btn{width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 8px rgba(59,130,246,0.4);}
.btn:hover{background:#2563eb;transform:translateY(-2px);box-shadow:0 6px 12px rgba(37,99,235,0.5);}
.link{text-align:center;margin-top:15px;font-size:0.9rem;color:#6b7280;}
.link a{color:#3b82f6;text-decoration:none;font-weight:500;}
.link a:hover{text-decoration:underline;}
.error-message{color:#ef4444;font-size:0.85rem;margin-top:5px;}
.success-message{color:#22c55e;font-size:0.85rem;margin-top:5px;}
.relative{position:relative;}
</style>
</head>
<body>
<div class="container">
<h2>EduTrack Signup</h2>
<p class="subtitle">Create a new account</p>
<form id="signupForm">
    <div class="form-group">
        <input type="text" id="name" name="name" placeholder="Full Name" required>
    </div>
    <div class="form-group">
        <input type="email" id="email" name="email" placeholder="Email" required>
    </div>
    <div class="form-group relative">
        <input type="password" id="password" name="password" placeholder="Password" required>
        <button type="button" class="password-toggle" id="togglePassword"><i class="ri-eye-line"></i></button>
    </div>
    <button type="submit" class="btn">Sign Up</button>
    <div id="message"></div>
</form>
<p class="link">Already have an account? <a href="login.php">Login</a></p>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Password toggle functionality
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-off-line"></i>';
    });

    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Check password length
        if (password.length < 6) {
            messageDiv.textContent = 'Password must be at least 6 characters';
            messageDiv.className = 'error-message';
            return;
        }

        const formData = new FormData();
        formData.append('action', 'signup');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        fetch('config/auth.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Signup response:', data);
            if (data === 'success') {
                messageDiv.textContent = 'Signup successful! Redirecting...';
                messageDiv.className = 'success-message';
                setTimeout(() => {
                    window.location.href = 'dashboard.php';
                }, 1000);
            } else if (data === 'short_password') {
                messageDiv.textContent = 'Password must be at least 6 characters';
                messageDiv.className = 'error-message';
            } else {
                messageDiv.textContent = 'Signup failed - email may already exist';
                messageDiv.className = 'error-message';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.textContent = 'Network error';
            messageDiv.className = 'error-message';
        });
    });
});
</script>
</body>
</html>