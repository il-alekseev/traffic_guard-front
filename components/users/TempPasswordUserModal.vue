<template>
  <BaseModal @close="closeModal">
    <template #header>
      <h2 class="modal__title">Временный пароль</h2>
      <p class="modal__text">
        Отправьте временный пароль пользователю
        <span class="modal__text-full-name">{{ props.user?.last_name + ' ' + props.user?.first_name + ' ' + (props.user?.patronymic || '')}} ({{ props.user?.login }})</span>
        После закрытия этого окна пароль будет недоступен для просмотра.
      </p>
    </template>

    <template #main>
      <div class="password">
        <div class="password__value-container" @click="copyToClipboard">
          <p class="password__value">{{ password }}</p>
          <div class="password__copy-icon">
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <CheckIcon v-else class="password__copy-icon_green" />
          </div>
        </div>
        <p v-if="copied" class="password__note">
          Пароль скопирован в буфер обмена
        </p>
      </div>
    </template>

    <template #footer>
      <BaseButton type="button" variant="secondary" :disabled="false" @click="closeModal">
        Закрыть
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { User } from '~/types/user';
import BaseModal from '~/components/UI/BaseModal.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import CheckIcon from '~/assets/img/check.svg';

const props = defineProps<{
  user: User | null;
  password: string;
}>();

const emit = defineEmits(['close']);

const copied = ref(false);

const closeModal = () => {
  emit('close');
};

const copyToClipboard = async () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    console.error('Clipboard API is not available');
    return;
  }
  try {
    await navigator.clipboard.writeText(props.password);
    copied.value = true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};


onMounted(() => {
  copyToClipboard();
});
</script>

<style scoped>
.modal__text-full-name {
  font-weight: 600;
}

.password {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}

.password__value-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f4f6;
  padding: 0.625rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.password__value {
  font-size: var(--font-size-sm);
  font-weight: 400;
  line-height: 1.25rem;
  color: var(--color-typo-primary);
}

.password__copy-icon {
  color: var(--color-typo-primary);
  width: 1rem;
  height: 1rem;
}

.password__copy-icon_green {
  color: #3E9B4F;
}

.password__note {
  font-weight: 400;
  font-size: var(--font-size-xs);
  line-height: 1.25rem;
  color: var(--color-typo-secondary);
}
</style>
