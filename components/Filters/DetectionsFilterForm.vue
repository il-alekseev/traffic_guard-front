<template>
  <div class="filters">
    <BaseAlert v-if="error">{{ error }}</BaseAlert>
    <form @submit.prevent="submitForm" class="filters__form">
      <div class="filters-form__group">

        <div class="base-form-field">
          <label for="status" class="base-label">Статус</label>
          <Dropdown
            :search="true"
            :localSearch="true"
            id="status"
            :items="allowedStatus"
            searchPlaceholder="Поиск..."
            v-model="form.status"
          />
        </div>

        <div class="base-form-field">
          <label for="category" class="base-label">Категория</label>
          <Dropdown
            :search="true"
            :localSearch="true"
            id="category"
            :items="allowedCategories"
            searchPlaceholder="Поиск..."
            v-model="form.category"
          />
        </div>

        <div class="base-form-field">
          <label for="location" class="base-label">Локация</label>
          <Dropdown
            :search="true"
            :localSearch="true"
            id="location"
            :items="allowedLocations"
            searchPlaceholder="Поиск..."
            v-model="form.location"
          />
        </div>

        <div class="base-form-field">
          <label for="device" class="base-label">Устройство</label>
          <Dropdown
            :search="true"
            :localSearch="true"
            id="device"
            :items="allowedDevices"
            searchPlaceholder="Поиск..."
            v-model="form.device"
          />
        </div>
      </div>

      <div class="filters-form__actions actions">
        <button type="button" class="actions__extra" @click="resetFilters">
          Очистить фильтры
        </button>

        <div class="actions__main">
          <BaseButton
            class="cancel-btn"
            type="button"
            variant="secondary"
            :disabled="loading"
            loadingText="Cохранение..."
            @click="emit('close')"
          >
            Отменить
          </BaseButton>

          <BaseButton
            class="submit-btn"
            type="submit"
            variant="primary"
            :loading="loading"
            :loadingText="'Загрузка...'"
          >
            Применить
          </BaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '~/types/dropdown';
import BaseButton from '~/components/UI/BaseButton.vue';
import BaseAlert from '~/components/UI/BaseAlert.vue';
import Dropdown from '~/components/UI/Dropdown.vue';

const emit = defineEmits<{
  setFilters: [filterData: DetectionsFilter];
  close: [];
}>();

const props = defineProps<{
  filtersData: DetectionsFilter | null
}>();


const loading = ref(false);
const error = ref('');

export interface DetectionsFilter {
  status: DropdownItem,
  category: DropdownItem,
  location: DropdownItem,
  device: DropdownItem
}

const form = reactive<DetectionsFilter>({
  status: {
    id: '',
    name: ''
  },
  category: {
    id: '',
    name: ''
  },
  location: {
    id: '',
    name: ''
  },
  device: {
    id: '',
    name: ''
  },
});

const allowedStatus = ref<DropdownItem[]>([
  {
    id: 'Все',
    name: 'Все',
  },
  {
    id: 'Рекомендуется блокировка',
    name: 'Рекомендуется блокировка',
  },
  {
    id: 'Требуется проверка',
    name: 'Требуется проверка',
  },
  {
    id: 'Заблокирован',
    name: 'Заблокирован',
  }
]);

const allowedCategories = ref<DropdownItem[]>([
  {
    id: 'Все',
    name: 'Все',
  },
  {
    id: 'Экстремизм',
    name: 'Экстремизм',
  },
  {
    id: 'Наркотики',
    name: 'Наркотики',
  },
  {
    id: 'Другое',
    name: 'Другое',
  }
])

const allowedLocations = ref<DropdownItem[]>([
  {
    id: 'Все',
    name: 'Все',
  },
  {
    id: 'Московская область',
    name: 'Московская область',
  },
  {
    id: 'Ленинградская область',
    name: 'Ленинградская область',
  },
  {
    id: 'Свердловская область',
    name: 'Свердловская область',
  },
  {
    id: 'Другое',
    name: 'Другое',
  }
])

const allowedDevices = ref<DropdownItem[]>([
  {
    id: 'Все',
    name: 'Все',
  },
  {
    id: 'ngfw-1',
    name: 'NGFW-1',
  },
  {
    id: 'NGFW-2',
    name: 'NGFW-2',
  },
  {
    id: 'NGFW-3',
    name: 'NGFW-3',
  },
  {
    id: 'Другое',
    name: 'Другое',
  }
])

const resetFilters = () => {
  form.category = {id: '', name: ''}
  form.device = {id: '', name: ''}
  form.location = {id: '', name: ''}
  form.status = {id: '', name: ''}
}

const submitForm = () => {
  emit('setFilters', form)
  emit('close');
}

const initForm = async () => {
  if (props.filtersData === null) return;

  form.status = props.filtersData.status;
  form.category = props.filtersData.category;
  form.location = props.filtersData.location;
  form.device = props.filtersData.device;
}

onMounted(() => {
  initForm()
})
</script>

<style scoped>
.filters {
  height: 100%;
}

.filters .base-alert {
  margin: 1.5rem 1.5rem;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-block__title {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #3F3F46;
}

.info-block__text {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #71717A;
}

.filters__form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filters-form__group {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #E4E4E7;
}

.actions__extra {
  border: none;
  background-color: #FFFFFF;
  color: #A1A1AA;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-left: 1.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  align-self: center;
}

.actions__main {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  margin-top: auto;
  padding: 1rem;
  justify-content: flex-end;
}

.extras {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.extras__title {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #3F3F46;
}

.extras__btns {
  display: flex;
  gap: 0.5rem;
}

.cancel-btn {
  max-width: 5.8125rem;
}

.submit-btn {
  max-width: 13rem;
}

.user-form__error-text {
  font-size: var(--font-size-xs);
  color: #EF4444;
}
</style>
