<template>
  <div class="register-container">
    <form @submit.prevent="registerUser" class="register-form">
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        v-model="username"
        required
      />
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
      <button type="submit" class="btn">Register</button>
      <NuxtLink to="/auth/login" class="btn secondary mt-3">Login</NuxtLink>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosApiCall from "~/lib/axiosApiCall";

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const router = useRouter();

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = "Passwords do not match";
    return;
  }
  try {
    await axiosApiCall.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    router.push("/auth/login");
  } catch (error) {
    message.value = "Registration failed. Try again.";
  }
};
</script>

<style scoped>
/* Import nezvyčajný font */
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap");

/* Container */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(86deg, #6d6d6d, #c5c5c5);
}

/* Card / Form */
.register-form {
  background: #fff;
  padding: 4rem 3rem;
  border-radius: 28px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

/* Heading */
.register-form h2 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #2a3a4f;
}

/* Inputs */
.register-form input {
  width: 100%;
  margin-bottom: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: 14px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
  font-size: 1.1rem;
}

.register-form input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
}

/* Buttons */
.btn {
  display: inline-block;
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  border: none;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #4a90e2;
  color: #fff;
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
}

.btn:hover {
  background: #3571c1;
  box-shadow: 0 12px 30px rgba(53, 113, 193, 0.4);
}

.btn.secondary {
  background: #f0f4f8;
  color: #4a90e2;
  border: 2px solid #4a90e2;
}

.btn.secondary:hover {
  background: #4a90e2;
  color: #fff;
  box-shadow: 0 12px 30px rgba(74, 144, 226, 0.4);
}

.mt-3 {
  margin-top: 1rem;
}

/* Message */
.message {
  color: rgb(220, 53, 69);
  font-weight: 700;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  bottom: 100px;
  position: absolute;
}

/* Responsive */
@media (max-width: 900px) {
  .register-form {
    margin: 1rem;
    padding: 3rem 2rem;
    border-radius: 24px;
  }

  .register-form h2 {
    font-size: 2rem;
  }

  .register-form input {
    font-size: 1rem;
  }

  .btn {
    font-size: 1.1rem;
    padding: 0.9rem;
  }
  .message {
    margin-top: 20px;
  }
}
* {
  font-family: "Orbitron", sans-serif;
}
</style>
