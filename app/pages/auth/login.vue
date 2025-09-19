<template>
  <div class="login-container">
    <form @submit.prevent="loginUser" class="login-form">
      <h2>Welcome Back</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        v-model="username"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref } from "vue";
import axiosApiCall from "~/lib/axiosApiCall";

const username = ref("");
const password = ref("");
const router = useRouter();
const message = ref("");

const loginUser = async () => {
  try {
    const response = await axiosApiCall.post(
      "/auth/login",
      {
        username: username.value,
        password: password.value,
      }
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("jwt"),
      //   },
      // }
    );
    localStorage.setItem("jwt", response.data.token);

    router.push("/dashboard");
    // message.value = response.data.message;
    // setTimeout(() => {

    // }, 2000);
    // Handle successful login
  } catch (error) {
    // Handle login error
  }
};
</script>

<style scoped>
.message {
  color: rgb(30, 192, 30);
  font-weight: 900;
  text-align: center;
  font-size: 30px;
  position: absolute;
  width: 100%;
  margin: 350px 0 0 0;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  font-family: "Inter", sans-serif;
}

.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-form h2 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #2a2a2a;
}

.login-form input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
  font-size: 1rem;
}

.login-form input:focus {
  border-color: #2a5298;
  box-shadow: 0 0 0 2px rgba(42, 82, 152, 0.3);
}

.login-form button {
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

.login-form button:hover {
  background: #1e3c72;
}
@media (max-width: 900px) {
  .login-form {
    margin: 2rem;
    border-radius: 12px;
  }
}
</style>
