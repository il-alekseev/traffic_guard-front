<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="login-form-group">
      <BaseInput
        id="email"
        name="email"
        type="email"
        label="Электронная почта"
        v-model="form.email"
        :error="errors.email"
        autocomplete="email"
      />

      <BaseInput
        id="password"
        name="password"
        type="password"
        label="Пароль"
        v-model="form.password"
        :error="errors.password"
        placeholder="••••••••"
        autocomplete="current-password"
      />
    </div>

    <div class="login-form-actions">
      <BaseButton
        type="submit"
        variant="login"
        :loading="props.loading"
        loadingText="Вход..."
      >
        Войти
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseInput from '~/components/UI/BaseInput.vue';
import BaseButton from '~/components/UI/BaseButton.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['login']);

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true;

  (Object.keys(errors) as (keyof typeof errors)[]).forEach(key => {
    errors[key] = '';
  });

  if (!form.email.trim()) {
    errors.email = 'Пожалуйста, введите почту';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Пожалуйста, введите корректную почту';
    isValid = false;
  }

  if (!form.password.trim()) {
    errors.password = 'Пожалуйста, введите пароль';
    isValid = false;
  }

  return isValid;
};
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  emit('login', {
    email: form.email,
    password: form.password
  });
};
</script>

<style>
.login-form {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #FFFFFF;
  box-shadow: 0px 1px 3px 0px #0000001A;
  border-radius: 1.5rem;
}

.login-form-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-form-actions {
  width: 100%;
}
</style>