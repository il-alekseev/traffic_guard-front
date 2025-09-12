<template>
  <div class="change-password">
    <div class="change-password__container">
      <div class="change-password__header">
        <div class="change-password__logo">
          <p>Fazenda</p>
        </div>
        <div class="change-password__text"> 
          <h2 class="change-password__title">Смена пароля</h2>
          <p class="change-password__subtitle">
            Задайте собственный пароль для входа в систему
          </p>
        </div>
      </div>

      <BaseAlert v-if="error">{{ error }}</BaseAlert>

      <FormComponent
        @change-password="changePassword"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from "~/stores/user";
import BaseAlert from '~/components/UI/BaseAlert.vue';
import FormComponent from '~/components/ChangePassword/FormComponent.vue';


definePageMeta({
  middleware: ['auth']
});


const router = useRouter();
const userStore = useUserStore();

const error = ref('');
const loading = ref(false);

const changePassword = async (password: string) => {
  error.value = '';
  loading.value = true;

  if (!userStore.user) {
    error.value = 'Произошла ошибка при смене пароля';
    return;
  }

  try {
    const oldPassword = localStorage.getItem('old_pass');

    if (!oldPassword) {
      router.push('/auth');
      return;
    }

    const success = await userStore.changePassword(oldPassword, password);

    if (success) {
      localStorage.clear();
      userStore.user.is_need_to_change_password = false;
      router.push('/dashboard');
    } else {
      error.value = 'Не удалось сменить пароль';
    }
  } catch (err) {
    console.error('Ошибка при смене пароля:', err);
    error.value = 'Произошла ошибка при смене пароля';
  } finally {
    loading.value = false;
  }
};

</script>

<style>
.change-password {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-white);
}

@media screen and (max-width: 520px) {
  .change-password {
    padding: var(--size-6);
  }
}

.change-password__container {
  max-width: 30rem;
  width: 100%;
  padding: 5rem;
  padding-top: 4rem;
  background-color: var(--color-white-tertiary);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media screen and (max-width: 520px) {
  .change-password__container {
    padding: 2rem;
    padding-top: 1.5rem;
  }
  
}

.change-password__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.change-password__logo {
  max-width: 7.875rem;
  max-height: 1.875rem;
  margin-left: auto;
  margin-right: auto;
}

.change-password__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.change-password__text {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
  text-align: center;
  color: var(--color-typo-primary);
}

.change-password__title {
  font-size: var(--font-size-3xl);
  line-height: 100%;
  font-weight: 600;
  line-height: 2.125rem;
}

@media screen and (max-width: 520px) {
  .change-password__title {
    font-size: var(--font-size-2xl);
  }
  
}

.change-password__subtitle {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-xs-tight);
  font-weight: 400;
}
</style>
