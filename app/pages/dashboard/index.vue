<template>
  <button @click="logout" class="logout-button">Logout</button>
  <div class="finance-app">
    <div class="finance-card">
      <div class="finance-header">YOUR FINANCE APP</div>

      <!-- create form for adding expenses -->
      <form @submit.prevent="addExpense" class="expense-form">
        <input
          type="number"
          v-model.number="expenseAmount"
          placeholder="Amount"
          required
          step="0.01"
        />
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
        <ul class="expenses-list">
          <li
            v-for="expense in expenses"
            :key="expense.id"
            class="expense-card"
          >
            <div class="expense-left">
              <span class="expense-desc">{{ expense.description }}</span>
              <span class="expense-amount"
                >{{ expense.amount.toFixed(2) }} €</span
              >
            </div>
            <div class="expense-right">
              <span :class="['expense-type', expense.expenseType]">{{
                expense.expenseType
              }}</span>
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
            </div>
          </li>
        </ul>
      </div>

      <div class="totals-grid">
        <div class="total-card">
          🍽️ Meals: <strong>{{ sumMealExpenses.toFixed(2) }} €</strong>
        </div>
        <div class="total-card">
          🚗 Car: <strong>{{ sumCarExpenses.toFixed(2) }} €</strong>
        </div>
        <div class="total-card">
          🏠 House: <strong>{{ sumHouseExpenses.toFixed(2) }} €</strong>
        </div>
      </div>
      <div class="total-card total-all">
        💰 Total: <strong>{{ sumExpenses.toFixed(2) }} €</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import axiosApiCall from "~/lib/axiosApiCall";
import { useRouter } from "vue-router";

type Expense = {
  id: string;
  description: string;
  amount: number;
  expenseType: string;
};
const expenses = ref<Expense[]>([]);
const expenseDescription = ref("");
const expenseAmount = ref(0);
const expenseType = ref("");

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

const getExpenses = async () => {
  try {
    const response = await axiosApiCall.get("/expenses");
    expenses.value = response.data.map((e: Expense) => ({
      ...e,
      amount: Number(e.amount),
    }));
  } catch (err) {
    console.log(err);
  }
};
const router = useRouter();
const logout = () => {
  localStorage.removeItem("jwt");
  router.push("/auth/login"); // Redirect to login page
};
onMounted(() => getExpenses());
</script>

<style scoped>
.finance-app {
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
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
  width: 100%;
  max-width: 800px;

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
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0;
    padding-bottom: 0;
    width: 95%;
    background: #f3f4f6;
    box-shadow: none;
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
</style>
