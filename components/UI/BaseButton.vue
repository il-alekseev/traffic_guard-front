<template>
  <button
    :type="type"
    class="base-button"
    :class="[`base-button--${variant}`, { 'base-button--loading': loading }, { 'base-button_red': danger }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading">{{ loadingText }}</span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  variant: {
    type: String as () => 'primary' | 'secondary' | 'outline',
    default: 'primary'
  },
  danger: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Загрузка...'
  }
});
</script>

<style>
.base-button {
  width: 100%;
  max-height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-block: 0.625rem;
  border-radius: var(--radius-sm);
  border-width: 0;
  font-size: var(--font-size-sm);
  line-height: 20px;
  font-weight: 500;
  transition: all var(--transition);
  cursor: pointer;
}

.base-button--primary {
  color: var(--color-white);
  background-color: var(--color-blue-main);
}

.base-button--primary:hover:not(:disabled) {
  filter: brightness(85%);
}

.base-button--secondary {
  color: var(--color-typo-primary);
  background-color: var(--color-white);
  border: 1px solid var(--color-border-primary);
}

.base-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 0.125rem var(--color-slate-300), 0 0 0 0.25rem rgba(255, 255, 255, 0.8);
}

.base-button_red {
  color: var(--color-white);
  background-color: #E5381A;
}
</style>