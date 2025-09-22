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
        variant="login"
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
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #FFFFFF;
  box-shadow: 0px 1px 3px 0px #0000001A;
  border-radius: 1.5rem;
}

.change-password-form__group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.change-password-form__actions {
  width: 100%;
}
</style>