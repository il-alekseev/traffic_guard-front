<template>
  <form class="change-password-form" @submit.prevent="handleSubmit">
    <div class="change-password-form__group">
      <BaseInput
        id="password"
        name="password"
        type="password"
        label="Введите новый пароль"
        v-model="form.password"
        :error="errors.password"
        placeholder="••••••••"
        autocomplete="current-password"
      />


      <BaseInput
        id="passwordRepeat"
        name="passwordRepeat"
        type="password"
        label="Подтвердите новый пароль"
        v-model="form.passwordRepeat"
        :error="errors.passwordRepeat"
        placeholder="••••••••"
        autocomplete="current-password"
      />
    </div>

    <div class="change-password-form__actions">
      <BaseButton
        type="submit"
        variant="primary"
        :loading="props.loading"
        loadingText="Смена пароля..."
      >
        Сменить пароль
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

const emit = defineEmits(['change-password']);

const form = reactive({
  password: '',
  passwordRepeat: ''
});

const errors = reactive({
  password: '',
  passwordRepeat: ''
});

const validateForm = () => {
  let isValid = true;

  (Object.keys(errors) as (keyof typeof errors)[]).forEach(key => {
    errors[key] = '';
  });

  if (!form.password.trim()) {
    errors.password = 'Пожалуйста, введите новый пароль';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'Пароль должен содержать не менее 8 символов';
    isValid = false;
  }

  if (!form.passwordRepeat.trim()) {
    errors.passwordRepeat = 'Пожалуйста, подтвердите пароль';
    isValid = false;
  } else if (form.password !== form.passwordRepeat) {
    errors.passwordRepeat = 'Пароли не совпадают';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  emit('change-password', form.password);
};
</script>

<style>
.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.change-password-form__group {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.change-password-form__actions {
  width: 100%;
}
</style>