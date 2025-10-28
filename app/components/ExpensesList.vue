<template>
  <ul class="expenses-list">
    <li v-for="expense in expenses" :key="expense.id" class="expense-card">
      <div class="expense-left">
        <span class="expense-desc">{{ expense.description }}</span>
        <span class="expense-amount amount">
          {{ expense.amount.toFixed(2) }} €
        </span>
      </div>
      <div class="expense-right">
        <span :class="['expense-type', expense.expenseType]">
          {{ expense.expenseType }}
        </span>
        <span class="amount">
          {{ formatDayMonth(expense.createdAt ?? "") }}
        </span>

        <!-- Delete kliknutie -->
        <svg
          @click="$emit('delete', expense.id)"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          class="delete-icon"
        >
          <path
            d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"
          />
        </svg>

        <!-- Edit kliknutie -->
        <svg
          @click="$emit('edit', expense.id)"
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
</template>

<script setup lang="ts">
type Expense = {
  id: string;
  description: string;
  amount: number;
  expenseType: string;
  createdAt?: string;
};

const props = defineProps<{
  expenses: Expense[];
}>();
defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", id: string): void;
}>();

const formatDayMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};
</script>

<style scoped>
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
  width: 70px;
  text-align: center;
  justify-self: center;
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
.expense-type.other {
  background: rgb(121, 121, 121);
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
.amount {
  font-family: "Exo 2", sans-serif;

  font-weight: bold;
}
</style>
