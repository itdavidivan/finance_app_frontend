<template>
  <div>YOUR FINANCE APP</div>
  <!-- create form for adding expenses -->
  <form @submit.prevent="addExpense">
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
  <div>
    <h2>EXPENSES</h2>
    <ul class="expenses-list">
      <li v-for="expense in expenses" :key="expense.id" class="expense-card">
        <div class="expense-left">
          <span class="expense-desc">{{ expense.description }}</span>
          <span class="expense-amount">{{ expense.amount.toFixed(2) }} €</span>
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
    <div class="total-card total-all">
      💰 Total: <strong>{{ sumExpenses.toFixed(2) }} €</strong>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import axiosApiCall from "~/lib/axiosApiCall";
type Expense = {
  id: string;
  description: string;
  amount: number;
  expenseType: string;
};
const sumMealExpenses = computed(() =>
  expenses.value
    .filter((expense) => expense.expenseType === "meal")
    .reduce((total, expense) => total + expense.amount, 0)
);
const sumCarExpenses = computed(() =>
  expenses.value
    .filter((expense) => expense.expenseType === "car")
    .reduce((total, expense) => total + expense.amount, 0)
);
const sumHouseExpenses = computed(() =>
  expenses.value
    .filter((expense) => expense.expenseType === "house")
    .reduce((total, expense) => total + expense.amount, 0)
);
const sumExpenses = computed(() =>
  expenses.value.reduce((total, expense) => total + expense.amount, 0)
);
const deleteExpense = async (id: string) => {
  try {
    await axiosApiCall.delete(`/expenses/${id}`);
    expenses.value = expenses.value.filter((expense) => expense.id !== id);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};
const expenseDescription = ref("");
const expenseAmount = ref(0);
const expenseType = ref("");
const expenses = ref<Expense[]>([]);
const addExpense = async () => {
  try {
    const response = await axiosApiCall.post("/expenses", {
      description: expenseDescription.value,
      amount: expenseAmount.value,
      expenseType: expenseType.value,
    });
    console.log("Expense added:", response.data);
    // Reset form fields
    expenseDescription.value = "";
    expenseAmount.value = 0;
    expenseType.value = "";
    expenses.value = [...expenses.value, response.data];
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};
const getExpenses = async () => {
  try {
    const response = await axiosApiCall.get("/expenses");
    expenses.value = response.data.map((e: Expense) => ({
      ...e,
      amount: Number(e.amount),
    }));
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getExpenses();
});
</script>
<style>
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg-light: #f3f4f6;
  --card-bg: #ffffff;
  --text-dark: #111827;
  --text-light: #6b7280;
  --border: #e5e7eb;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: var(--bg-light);
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
}

/* ▸ centrálny kontajner */
body > div {
  /* z parent <div> urobíme centrálnu „app card“ */

  display: flex;
  justify-content: center;
  align-items: center;
}

/* ▸ vnútorný layout: karta s dvomi stĺpcami */
body > div > div {
  background: var(--card-bg);
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  width: 90%;
  max-width: 900px;
  margin-top: 180px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Nadpis */
body > div > div > div:first-child {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

/* Formulár */
form {
  background: none;
  box-shadow: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

form input,
form select {
  padding: 0.7rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  font-size: 1rem;
}

form input:focus,
form select:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

form button {
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

form button:hover {
  background: var(--primary-hover);
}

/* Zoznam výdavkov */
h2 {
  margin: -33px 0px 1rem;
  font-size: 3.3rem;
  font-weight: 700;
  color: var(--text-dark);
  text-align: center;
  text-shadow: 2px 6px 6px rgba(0, 0, 0, 0.5);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
  max-height: 220px;
  overflow-y: auto; /* jemný scroll len keď je naozaj veľa položiek */
}

li {
  background: var(--bg-light);
  padding: 0.6rem 0.8rem;
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  border: 1px solid var(--border);
}

li button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.35rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 1.2rem;
}

li button:hover {
  background: #dc2626;
}

/* Súhrny */
div > div {
  margin-top: 1rem;
  font-weight: 500;
  color: var(--text-light);
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
svg {
  width: 26px;
  height: 26px;
  fill: #ef4444;
  cursor: pointer;
  transition: fill 0.2s;
}
@media (max-width: 768px) {
  /* na menšom displeji prepneme layout na jeden stĺpec */
  body > div > div {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
/* ▸ hlavný vnútorný kontajner (body > div > div) necháme ako grid */
body > div > div {
  display: grid;
  grid-template-rows: auto 1fr auto; /* hlavička, obsah, súhrn dole */
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Súhrny roztiahneme na celú šírku (cez oba stĺpce) */
.totals-grid {
  grid-column: 1 / -1; /* natiahne sa cez oba stĺpce */
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto; /* vytlačí ho to dole */
  width: 100%;
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

.expenses-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  color: white;
}

.expense-type.meal {
  background-color: #f97316;
}

.expense-type.car {
  background-color: #3b82f6;
}

.expense-type.house {
  background-color: #10b981;
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
</style>
