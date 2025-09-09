<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Hello 👋</h1>
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
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  font-family: "Inter", sans-serif;
}

.home-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.home-card h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
  color: #2a2a2a;
}

.home-card p {
  margin-bottom: 2rem;
  color: #555;
  font-size: 1rem;
}

.links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
  font-size: 1rem;
  cursor: pointer;
}

.btn {
  background: #2a5298;
  color: #fff;
}

.btn:hover {
  background: #1e3c72;
}

.btn.secondary {
  background: #f4f4f4;
  color: #2a5298;
  border: 1px solid #2a5298;
}

.btn.secondary:hover {
  background: #2a5298;
  color: #fff;
}
</style>
