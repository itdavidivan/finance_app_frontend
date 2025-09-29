<template>
  <button @click="logout" class="logout-button">Logout</button>
  <div class="finance-app">
    <div class="finance-card">
      <div class="finance-header">YOUR FINANCE APP</div>
      <ModalWrapper
        v-if="isModalOpened"
        @modalClose="isModalOpened = false"
        width="420px"
      >
        <div class="edit-expense-modal">
          <h2 class="modal-title">Edit Expense</h2>

          <form class="modal-form" @submit.prevent="editExpense">
            <div class="form-group">
              <label>Amount (€)</label>
              <input
                v-model.number="expenseEditedAmount"
                type="number"
                class="input amount"
                placeholder="Amount"
                step="0.01"
                required
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <input
                v-model="expenseEditedDescription"
                type="text"
                class="input"
                placeholder="Description"
                required
              />
            </div>

            <div class="form-group">
              <label>Type</label>
              <select v-model="expenseEditedType" class="input" required>
                <option value="meal">Meal</option>
                <option value="car">Car</option>
                <option value="house">House</option>
              </select>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="isModalOpened = false"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </ModalWrapper>
      <!-- create form for adding expenses -->
      <form @submit.prevent="addExpense" class="expense-form">
        <div class="amount-wrapper">
          <input
            type="number"
            v-model.number="expenseAmount"
            placeholder="Amount"
            required
            step="0.01"
            class="amount"
          />
          <span class="currency">€</span>
        </div>
        <input
          type="text"
          v-model="expenseDescription"
          placeholder="Description"
          required
        />
        <select v-model="expenseType" placeholder="Type" required>
          <option value="meal">Meal</option>
          <option value="car">Car</option>
          <option value="house">House</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <div class="expenses-section">
        <h2>EXPENSES</h2>
        <div v-if="loading" class="loader-container">
          <div class="loader"></div>
        </div>
        <ul class="expenses-list">
          <li
            v-for="expense in expenses"
            :key="expense.id"
            class="expense-card"
          >
            <div class="expense-left">
              <span class="expense-desc">{{ expense.description }}</span>
              <span class="expense-amount amount"
                >{{ expense.amount.toFixed(2) }} €</span
              >
            </div>
            <div class="expense-right">
              <span :class="['expense-type', expense.expenseType]">{{
                expense.expenseType
              }}</span>
              <span class="amount">
                {{ formatDayMonth(expense.createdAt ?? "") }}</span
              >

              <svg
                @click="deleteExpense(expense.id)"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                class="delete-icon"
              >
                <path
                  d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
                />
              </svg>
              <svg
                @click="openModal(expense.id)"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                class="edit-icon"
              >
                <path
                  d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>

      <div class="totals-grid">
        <div class="total-card">
          🍽️ Meals:
          <strong class="amount">{{ sumMealExpenses.toFixed(2) }} €</strong>
        </div>
        <div class="total-card">
          🚗 Car:
          <strong class="amount">{{ sumCarExpenses.toFixed(2) }} €</strong>
        </div>
        <div class="total-card">
          🏠 House:
          <strong class="amount">{{ sumHouseExpenses.toFixed(2) }} €</strong>
        </div>
      </div>
      <div class="total-card total-all">
        💰 Total: <strong class="amount">{{ sumExpenses.toFixed(2) }} €</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import axiosApiCall from "~/lib/axiosApiCall";
import { useRouter } from "vue-router";
import ModalWrapper from "~/components/ModalWrapper.vue";

type Expense = {
  id: string;
  description: string;
  amount: number;
  expenseType: string;
  createdAt?: string;
};
const modalValue = ref(false);
const expenses = ref<Expense[]>([]);
const expenseDescription = ref("");
const expenseAmount = ref(0);
const expenseType = ref("");
const expenseCreatedAt = ref("");
const selectedEditId = ref("");
const expenseEditedDescription = ref("");
const expenseEditedAmount = ref(0);
const expenseEditedType = ref("");
const isModalOpened = ref(false);

const modalClose = () => {
  isModalOpened.value = false;
};
const sumMealExpenses = computed(() =>
  expenses.value
    .filter((e) => e.expenseType === "meal")
    .reduce((t, e) => t + e.amount, 0)
);
const sumCarExpenses = computed(() =>
  expenses.value
    .filter((e) => e.expenseType === "car")
    .reduce((t, e) => t + e.amount, 0)
);
const sumHouseExpenses = computed(() =>
  expenses.value
    .filter((e) => e.expenseType === "house")
    .reduce((t, e) => t + e.amount, 0)
);
const sumExpenses = computed(() =>
  expenses.value.reduce((t, e) => t + e.amount, 0)
);
const addExpense = async () => {
  try {
    const response = await axiosApiCall.post("/expenses", {
      description: expenseDescription.value,
      amount: expenseAmount.value,
      expenseType: expenseType.value,
    });

    // Správne transformovať na Expense typ
    const newExpense: Expense = {
      id: response.data.id,
      description: response.data.description,
      amount: Number(response.data.amount), // dôležité!
      expenseType: response.data.expenseType,
      createdAt: response.data.createdAt,
    };

    // Pushnúť reaktívny objekt
    expenses.value = [...expenses.value, newExpense];

    // Reset form
    expenseDescription.value = "";
    expenseAmount.value = 0;
    expenseType.value = "";
  } catch (err) {
    console.error(err);
  }
};

const deleteExpense = async (id: string) => {
  try {
    await axiosApiCall.delete(`/expenses/${id}`);
    expenses.value = expenses.value.filter((e) => e.id !== id);
  } catch (err) {
    console.error(err);
  }
};
const loading = ref(false);
const getExpenses = async () => {
  try {
    loading.value = true;
    const response = await axiosApiCall.get("/expenses");
    expenses.value = response.data.map((e: Expense) => ({
      ...e,
      amount: Number(e.amount),
    }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const editExpense = async () => {
  try {
    await axiosApiCall.put(`/expenses/${selectedEditId.value}`, {
      description: expenseEditedDescription.value,
      amount: expenseEditedAmount.value,
      expenseType: expenseEditedType.value,
    });
    // Aktualizovať lokálny stav podľa potreby
    isModalOpened.value = false; // Zavrieť modal
    getExpenses(); // Obnoviť zoznam
  } catch (err) {
    console.error(err);
  }
};
const openModal = (id: string) => {
  // Implementovať editáciu podľa potreby
  isModalOpened.value = true;
  selectedEditId.value = id;
  const editedExpense = expenses.value.find((e) => e.id === id);
  if (editedExpense) {
    expenseEditedDescription.value = editedExpense.description;
    expenseEditedAmount.value = editedExpense.amount;
    expenseEditedType.value = editedExpense.expenseType;
  }
};
const formatDayMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};
const router = useRouter();
const logout = () => {
  localStorage.removeItem("jwt");
  router.push("/auth/login"); // Redirect to login page
};
onMounted(() => {
  const token = localStorage.getItem("jwt");
  if (token) {
    getExpenses(); // Načíta údaje hneď, keď je token
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap");
.finance-app {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.finance-card {
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;

  display: grid;

  grid-template-rows: auto 1fr auto;
  gap: 2rem;
}

.finance-header {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

/* Form */
.expense-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.expense-form input,
.expense-form select {
  padding: 0.7rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
}

.expense-form input:focus,
.expense-form select:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.expense-form button {
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.expense-form button:hover {
  background: #4338ca;
}

/* Expenses */
.expenses-section {
  grid-column: 1/-1;
}
.expenses-section h2 {
  font-size: 3.3rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  text-shadow: 2px 6px 6px rgba(0, 0, 0, 0.5);
}

.expenses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
  max-height: 320px;
  overflow-y: auto;
}

.expense-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s ease;
}

.expense-card:hover {
  transform: translateY(-2px);
}

.expense-left {
  display: flex;
  flex-direction: column;
}
.expense-desc {
  font-weight: 600;
  color: #111827;
}
.expense-amount {
  color: #6b7280;
}
.expense-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.expense-type {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  text-transform: capitalize;
  font-weight: 500;
  color: #fff;
}
.expense-type.meal {
  background: #f97316;
}
.expense-type.car {
  background: #3b82f6;
}
.expense-type.house {
  background: #10b981;
}

.delete-icon {
  width: 20px;
  height: 20px;
  fill: #ef4444;
  cursor: pointer;
  transition: fill 0.2s;
}
.delete-icon:hover {
  fill: #b91c1c;
}
.edit-icon {
  width: 20px;
  height: 20px;
  fill: #3b82f6;
  cursor: pointer;
  transition: fill 0.2s;
}
.edit-icon:hover {
  fill: #1e40af;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px; /* výška loader sekcie */
}

.loader {
  border: 6px solid #e5e7eb; /* svetlý kruh */
  border-top: 6px solid #4f46e5; /* farba animovaného segmentu */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

/* Totals grid */
.totals-grid {
  grid-column: 1/-1;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin-top: auto;
}

.total-card {
  background: #eef2ff;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
}

.total-all {
  background: #d1fae5;
}

/* Hide number spinner */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.logout-button {
  background: #2a5298;
  color: #fff;
  font-weight: bold;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  position: absolute;
  top: 10px;
  right: 10px;
}

.logout-button:hover {
  background: #1e3c72;
}
/* Hlavný obal modalu */
.edit-expense-modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Nadpis */
.modal-title {
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
}

/* Formulár */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Skupina label + input */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.9rem;
  color: #374151; /* Tailwind gray-700 */
}

/* Inputy a select */
.input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

/* Tlačidlá */
.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.btn {
  padding: 0.55rem 1.2rem;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border: none;
}

.btn-primary {
  background-color: #3b82f6; /* blue-500 */
  color: #fff;
}
.btn-primary:hover {
  background-color: #2563eb; /* blue-600 */
}

.btn-secondary {
  background-color: #e5e7eb; /* gray-200 */
  color: #374151; /* gray-700 */
}
.btn-secondary:hover {
  background-color: #d1d5db; /* gray-300 */
}
.expense-form input,
.expense-form select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

/* EUR wrapper */
.amount-wrapper {
  position: relative;
  width: 100%;
}

.amount-wrapper .amount {
  width: 100%;
  padding-right: 2rem; /* miesto na € */
  height: 100%; /* nech drží výšku ako ostatné */
  box-sizing: border-box;
}

.amount-wrapper .currency {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
  font-size: 1rem;
  font-family: "Raleway", sans-serif;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .finance-card {
    grid-template-columns: 1fr;
  }
  .totals-grid {
    flex-direction: column;
  }
}
/* Existing styles remain the same */

/* Responsive */
@media (max-width: 1024px) {
  .finance-card {
    padding: 1.5rem;
  }

  .expense-form {
    flex-direction: column;
    gap: 0.7rem;
    align-items: stretch;
  }

  .expense-form input,
  .expense-form select,
  .expense-form button {
    width: 100%;
  }

  .totals-grid {
    flex-direction: column;
    gap: 0.8rem;
  }

  .expenses-section h2 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .finance-card {
    width: 90%; /* alebo 100% */
    margin: 1rem auto; /* centrovanie na stred */
    padding: 1rem;
    background: #ffffff; /* ak nechceš, aby splývala s pozadím */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  .finance-header {
    font-size: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 0;
  }
  .finance-app {
    min-height: 85vh;
    background: #f3f4f6;
  }
  .expenses-section h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .expense-form input,
  .expense-form select,
  .expense-form button {
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .total-card {
    font-size: 0.9rem;
    padding: 0.7rem;
  }

  .delete-icon {
    width: 18px;
    height: 18px;
  }

  .logout-button {
    font-size: 0.9rem;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .finance-card {
    padding: 0.8rem;
  }

  .expense-form {
    gap: 0.5rem;
  }

  .expenses-section h2 {
    font-size: 1.6rem;
  }

  .expense-form input,
  .expense-form select,
  .expense-form button {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .total-card {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .delete-icon {
    width: 16px;
    height: 16px;
  }

  .logout-button {
    top: 5px;
    right: 5px;
    padding: 0.6rem;
    font-size: 0.85rem;
  }
}
.amount {
  font-family: "Exo 2", sans-serif;

  font-weight: bold;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
* {
  font-family: "Orbitron", sans-serif;
}
</style>
