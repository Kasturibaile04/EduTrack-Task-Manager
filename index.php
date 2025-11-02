<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduTrack - Task Management</title>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet"/>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@100..900&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo">
        <i class="ri-task-line"></i>
        <span>EduTrack</span>
      </div>
      <div class="nav-actions">
        <?php if (isset($_SESSION['user_id'])): ?>
          <a href="dashboard.php" class="nav-btn secondary">Dashboard</a>
          <a href="config/auth.php?action=logout" class="nav-btn primary">Logout</a>
        <?php else: ?>
          <a href="login.php" class="nav-btn secondary" id="login-btn">Log In</a>
          <a href="signup.php" class="nav-btn primary" id="signup-btn">Get Started</a>
        <?php endif; ?>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✨ Task Management</span>
        </div>
        <h1 class="hero-title">
          Get More Done with 
          <span class="gradient-text">EduTrack.</span>
        </h1>
        <p class="hero-description">
          The intelligent platform that helps teams organize, track, and complete work efficiently. 
          Streamline your workflow with AI-powered insights.
        </p>
        <div class="hero-actions">
          <?php if (isset($_SESSION['user_id'])): ?>
            <a href="dashboard.php" class="btn primary-btn">
              <i class="ri-dashboard-line"></i>Go to Dashboard
            </a>
          <?php else: ?>
            <a href="signup.php" class="btn primary-btn" id="try-free-btn">
              <i class="ri-rocket-line"></i>Try for Free
            </a>
            <a href="#features" class="btn secondary-btn">
              <i class="ri-eye-line"></i>See Features
            </a>
          <?php endif; ?>
        </div>
        <div class="hero-features">
          <div class="feature-item">
            <i class="ri-checkbox-circle-fill"></i>
            <span>No credit card required</span>
          </div>
          <div class="feature-item">
            <i class="ri-checkbox-circle-fill"></i>
            <span>Free forever plan</span>
          </div>
          <div class="feature-item">
            <i class="ri-checkbox-circle-fill"></i>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <img src="images/img.png" alt="EduTrack Dashboard" class="hero-image">
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features" id="features">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Features</div>
        <h2>Everything You Need to Succeed</h2>
        <p>Powerful features designed to boost your team's productivity and collaboration</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="ri-team-line"></i>
          </div>
          <h3>Team Collaboration</h3>
          <p>Work together seamlessly with real-time updates, comments, and file sharing in shared workspaces.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="ri-calendar-todo-line"></i>
          </div>
          <h3>Smart Scheduling</h3>
          <p>AI-powered task scheduling with automatic prioritization and deadline management.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="ri-bar-chart-fill"></i>
          </div>
          <h3>Analytics Dashboard</h3>
          <p>Visualize project progress with beautiful charts and get insights into team productivity.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="workflow">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">How It Works</div>
        <h2>Simple Setup, Powerful Results</h2>
        <p>Get started in minutes and see immediate improvements in your workflow</p>
      </div>
      <div class="workflow-steps">
        <div class="step">
          <div class="step-number">01</div>
          <div class="step-icon">
            <i class="ri-user-add-line"></i>
          </div>
          <h3>Create Account</h3>
          <p>Sign up in seconds and set up your workspace with our intuitive onboarding.</p>
        </div>
        <div class="step">
          <div class="step-number">02</div>
          <div class="step-icon">
            <i class="ri-team-line"></i>
          </div>
          <h3>Invite Team</h3>
          <p>Add your team members and start collaborating immediately with role-based access.</p>
        </div>
        <div class="step">
          <div class="step-number">03</div>
          <div class="step-icon">
            <i class="ri-send-plane-fill"></i>
          </div>
          <h3>Launch Projects</h3>
          <p>Create projects, assign tasks, and track progress with our intuitive interface.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2>Ready to Transform Your Workflow?</h2>
        <p>Join thousands of teams who use EduTrack to achieve more together</p>
        <div class="cta-actions">
          <?php if (isset($_SESSION['user_id'])): ?>
            <a href="dashboard.php" class="btn primary-btn large">
              <i class="ri-dashboard-line"></i>Go to Dashboard
            </a>
          <?php else: ?>
            <a href="signup.php" class="btn primary-btn large" id="get-started-btn">
              <i class="ri-rocket-line"></i>Get Started Free
            </a>
            <a href="signup.php" class="btn secondary-btn large" id="signin-btn">
              <i class="ri-login-box-line"></i>Sign In
            </a>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="nav-logo">
            <i class="ri-task-line"></i>
            <span>EduTrack</span>
          </div>
          <p>Modern task management for modern teams</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Updates</a>
          </div>
          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 EduTrack. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="js/script.js"></script>
</body>
</html>