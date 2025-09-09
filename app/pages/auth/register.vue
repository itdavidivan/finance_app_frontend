<template>
  <div class="register-container">
    <form action="/auth/register" method="post" class="register-form">
      <h2>Create Account</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        v-model="email"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="password"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        v-model="confirmPassword"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  font-family: "Inter", sans-serif;
}

.register-form {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.register-form h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #2a2a2a;
}

.register-form input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
  font-size: 1rem;
}

.register-form input:focus {
  border-color: #2a5298;
  box-shadow: 0 0 0 2px rgba(42, 82, 152, 0.3);
}

.register-form button {
  width: 100%;
  background: #2a5298;
  color: #fff;
  font-weight: bold;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.register-form button:hover {
  background: #1e3c72;
}
</style>
