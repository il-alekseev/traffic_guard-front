<template>
  <div class="base-form-field">
    <label :for="id" class="base-label">{{ label }} <span class="not-requires-msg" v-if="props.required === false">необязательно</span></label>
    <div v-if="type === 'password'" class="base-password-container">
      <input
        :required="props.required"
        :id="id"
        :name="name"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="base-input"
        :class="{ 'base-input--error': error, 'base-input--disabled': props.disabled}"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="props.disabled"
      />
      <button
        type="button"
        class="base-password-toggle"
        @click="togglePassword"
        tabindex="-1"
      >
        <img v-if="!showPassword" src="/icons/main/eye.svg" alt="Показать">
        <img v-else src="/icons/main/eye-off.svg" alt="Скрыть">
      </button>
    </div>
    <input
      v-else
      :required="props.required"
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      @input="$emit(
        'update:modelValue',
        type === 'number'
          ? Number(($event.target as HTMLInputElement).value)
          : ($event.target as HTMLInputElement).value
      )"
      class="base-input"
      :class="{ 'base-input--error': error, 'base-input--disabled': props.disabled}"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="props.disabled"
    />
    <p v-if="props.extraInfo" class="base-form-hint-text">
      {{ props.extraInfo }}
    </p>
    <p v-if="error" class="base-form-error-text">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  extraInfo: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean, 
    default: true,
  },
  autocomplete: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style>
.base-form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-label {
  font-size: var(--font-size-sm);
  font-weight: 400;
  line-height: 20px;
  color: var(--color-typo-primary);
}

.base-input {
  width: 100%;
  padding: 0.625rem;
  font-size: var(--font-size-sm);
  line-height: 20px;
  color: var(--color-typo-primary);
  background-color: var(--color-white);
  outline: 1px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  border: 0;
  transition: all var(--transition);
}

.base-input--error {
  outline-color: #EF4444;
}

.base-input--disabled {
  background-color: var(--color-gray-disabled);
}

.base-input--error:focus {
  box-shadow: 0 0 0 0.125rem rgba(239, 68, 68, 0.3);
}

.base-input::placeholder {
  color: var(--color-typo-placeholder);
}

.base-password-container {
  position: relative;
}

.base-password-toggle {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: var(--font-size-xs);
  cursor: pointer;
  padding: 0.25rem;
  transition: all var(--transition);
}

.base-form-error-text {
  font-size: var(--font-size-xs);
  color: #EF4444;
}

.base-form-hint-text {
  font-size: var(--font-size-xs);
  line-height: 12px;
  color: var(--color-typo-secondary);
}

.not-requires-msg {
  color: var(--color-typo-placeholder);
  font-size: var(--font-size-sm);
  line-height: 20px;
  font-weight: 400;
}
</style>