<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Finance</h1>
      <p>Welcome to Finance Tracker</p>
      <div class="links">
        <NuxtLink to="/auth/login" class="btn">Login</NuxtLink>
        <NuxtLink to="/auth/register" class="btn secondary">Register</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
/* Import nezvyčajný font (napr. "Orbitron") */
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap");

/* Container */
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(86deg, #6d6d6d, #c5c5c5);
}

/* Card */
.home-card {
  background: #fff;
  padding: 4rem 3rem;
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 550px; /* väčšia card */
  text-align: center;
}

/* Text */
.home-card h1 {
  margin-bottom: 1rem;
  font-size: 3rem;
  color: #2a3a4f;
}

.home-card p {
  margin-bottom: 3rem;
  color: #555;
  font-size: 1.25rem;
}

/* Buttons */
.links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn {
  background: #4a90e2; /* jemná modrá */
  color: #fff;
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
}

.btn:hover {
  background: #3571c1;
  box-shadow: 0 12px 30px rgba(53, 113, 193, 0.4);
}

.btn.secondary {
  background: #f0f4f8; /* jemná neutrálna */
  color: #4a90e2;
  border: 2px solid #4a90e2;
}

.btn.secondary:hover {
  background: #4a90e2;
  color: #fff;
  box-shadow: 0 12px 30px rgba(74, 144, 226, 0.4);
}

/* Responsive */
@media (max-width: 900px) {
  .home-card {
    margin: 1rem;
    padding: 3rem 2rem;
    border-radius: 24px;
  }

  .home-card h1 {
    font-size: 2.2rem;
  }

  .home-card p {
    font-size: 1.1rem;
  }

  .btn {
    padding: 0.9rem 2rem;
    font-size: 1.1rem;
  }
}
* {
  font-family: "Orbitron", sans-serif;
}
</style>
