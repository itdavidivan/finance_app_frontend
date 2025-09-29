<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="closeOnOverlay ? emitClose() : null"
      >
        <div class="modal-content" @click.stop :style="{ width }">
          <!-- Close button -->
          <button v-if="showClose" class="modal-close" @click="emitClose">
            ✕
          </button>

          <!-- Header slot -->
          <header v-if="$slots.header" class="modal-header">
            <slot name="header"></slot>
          </header>

          <!-- Main body -->
          <main class="modal-body">
            <slot></slot>
          </main>

          <!-- Footer slot -->
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const modelValue = defineModel<boolean>({ required: true });
const props = defineProps({
  width: { type: String, default: "500px" }, // šírka modalu
  showClose: { type: Boolean, default: true }, // zobraziť ✕ button
  closeOnOverlay: { type: Boolean, default: true }, // zavrieť klikom na pozadie
});

const emit = defineEmits(["update:modelValue"]);

const emitClose = () => emit("update:modelValue", false);
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Modal box */
.modal-content {
  background: #fff;
  border-radius: 16px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: scaleIn 0.2s ease;
}

/* Close button */
.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1.25rem;
  cursor: pointer;
}

/* Slots styling */
.modal-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.modal-body {
  font-size: 1rem;
  line-height: 1.4;
}
.modal-footer {
  margin-top: 1rem;
  text-align: right;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
