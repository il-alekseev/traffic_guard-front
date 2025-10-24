<template>
  <div class="dashboard-page">
    <div class="dashboard__header">
      <div class="dashboard__header-block">
        <div class="dashboard__header-title-block">
          <h1 class="dashboard__title page-title">Нет новых выявлений</h1>
          <div class="dashboard__subtitle-block page-subtitle-block">
            <p class="dashboard__subtitle page-subtitle">Обновлено 5 мин назад</p>
            <div class="dashboard__refresh-btn page-refresh-btn" @click="fetchData">
              <ReloadIcon />
            </div>
          </div>
        </div>
        <div class="dashboard__filters">
          <div class="dashboard__datepicker-container">
            <DatePicker v-model="dateRange" />
          </div>
          <button class="dashboard__filter-button" @click="showFilters">
            <div class="dashboard__filter-button-icon">
              <FilterIcon />
            </div>
            <span class="dashboard__filter-button-text">Фильтр</span>
          </button>
          <DownloadButton />
        </div>
      </div>
    </div>

    <div class="dashboard-data">
      <ErrorBlock v-if="fetchError !== ''" :fetch-error="fetchError"/>

      <div v-if="loading" class="dashboard__loading">
        Загрузка данных...
      </div>

      <div v-else-if="!data" class="dashboard__empty">
        Данные не найдены
      </div>

      <div v-else class="resources-grid">
        DATA
      </div>
    </div>

    <SideModal
      v-model="isShowFilters"
      title="Фильтры"
      @close="closeFilters"
    >
      <FilterForm
        :filtersData="filtersData"
        @close="closeFilters"
        @setFilters="handleSetFilters"
      />

    </SideModal>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user'
import DatePicker from '~/components/UI/DatePicker.vue';
import DownloadButton from '~/components/UI/DownloadButton.vue';
import SideModal from '~/components/UI/SideModal.vue';
import ErrorBlock from '~/components/UI/ErrorBlock.vue';
import FilterForm, { type DashboardFilter } from '~/components/Filters/DashboardFilterForm.vue';
import ReloadIcon from "~/assets/img/reload.svg"
import FilterIcon from "~/assets/img/filter-icon.svg"


const route = useRoute();
const router = useRouter();

definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});

const dateRange = ref<{ from: Date | null; to: Date | null }>({
  from: new Date(2025, 7, 1),
  to: new Date(2025, 8, 1)
})

const loading = ref(true);
const fetchError = ref('');

const data = ref();

const fetchData = async () => {
  console.log('fetchData');
  loading.value = false;
  fetchError.value = 'Произошла ошибка'
}

const isShowFilters = ref(false);

const showFilters = () => {
  isShowFilters.value = true;
}

const closeFilters = () => {
  isShowFilters.value = false;
}

const deviceFilter = ref<string | undefined>();

const filtersData = computed<DashboardFilter | null>(() => {
  const device = deviceFilter.value ?? '';

  if (!device) {
    return null;
  }

  return {
    device: { id: device, name: device },
  };
});

const initFiltersFromUrl = async () => {
  const query = route.query;

  deviceFilter.value = query.device != null ? String(query.device) : undefined;
};

const updateUrlParams = () => {
  const query: Record<string, string | number> = {};

  if (deviceFilter.value && deviceFilter.value !== '') query.device = deviceFilter.value;

  router.replace({ query });
};

const handleSetFilters = (filtersData: DashboardFilter) => {
  filtersData.device.id !== '' ? deviceFilter.value = filtersData.device.id : deviceFilter.value = undefined;

  updateUrlParams()
}

onMounted(async () => {
  await initFiltersFromUrl();
  await fetchData();
});
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    const withoutCreate = (q: typeof newQuery) => {
      const { create, ...rest } = q;
      return JSON.stringify(rest);
    };

    if (withoutCreate(newQuery) === withoutCreate(oldQuery)) {
      return;
    }

    initFiltersFromUrl();
    await fetchData();
  },
  { deep: true }
);


</script>

<style lang="scss" scoped>

.dashboard__header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard__header-title-block {
  display: flex;
  gap: 0.75rem;
}

.dashboard__subtitle-block {
  align-self: flex-end;
}

.dashboard__loading,
.dashboard__empty {
  text-align: center;
  padding: 2rem;
  color: #3F3F46;
}

.dashboard-data {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  min-height: calc(100vh - 21rem);
}


.dashboard__filter-button {
  background-color: #FFFFFF;
  box-shadow: 0px 1px 2px 0px #0000000D;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.dashboard__filter-button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #A1A1AA;
}

.dashboard__filter-button-icon svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dashboard__filter-button-text {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #3F3F46;
}

.dashboard__filter-selected-area {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.dashboard__filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard__download-btn {
  padding: 0.5rem;
  background-color: #FFFFFF;
  box-shadow: 0px 1px 2px 0px #0000000D;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard__download-btn svg {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

</style>
