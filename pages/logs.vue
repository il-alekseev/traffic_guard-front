<template>
  <div class="logs-page">
    <div class="logs__header">
      <h1 class="logs__title page-title">Логи</h1>
      <div class="logs__toolbar">
        <BaseSearch
          v-model="searchQuery"
          class="logs__search"
          placeholder="Поиск по URL"
          @search="applyFilters"
        />
        <!-- <FilterButton @click="showFilters"/> -->
      </div>
    </div>

    <ErrorBlock v-if="fetchError !== ''" :fetch-error="fetchError" />

    <BaseTable
      :items="logs"
      :columns="columns"
      :loading="loading"
      :fetch-error="fetchError"
      :total-items="totalLogs"
      :total-pages="totalPages"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      prefix="logs"
      @page-change="handleChangePage"
      @action-click="handleActionClick"
    >
      <template #cell-datetime_utc="{ value }">
        <span class="logs__table-cell-datetime_utc">
          {{ new Date(value).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) }}
        </span>
      </template>
      <template #action-button="{ item }">
        <ContextMenuDotsIcon class="table__action-icon logs__action-icon" />
      </template>
    </BaseTable>

    <!-- <SideModal
      v-model="isShowFilters"
      title="Фильтры"
      @close="closeFilters"
    >

    </SideModal> -->
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import SideModal from '~/components/ui/SideModal.vue';
import FilterButton from '~/components/ui/FilterButton.vue';
import { useLogsStore } from '~/stores/logs';
import BaseSearch from '~/components/ui/BaseSearch.vue';
import ErrorBlock from '~/components/ui/ErrorBlock.vue';
import BaseTable from '~/components/ui/BaseTable.vue';
import ContextMenuDotsIcon from '~/assets/img/context-menu-btn.svg';
import type { Log, LogTable } from '~/types/logs';


definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

const logsStore = useLogsStore();

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const fetchError = ref('');

const logs = ref<Log[]>([]);
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'status', label: 'Статус' },
  { key: 'datetime_utc', label: 'Дата и время' },
  { key: 'source', label: 'Источник' },
  { key: 'user', label: 'Пользователь' },
  { key: 'context', label: 'Контекст' },
];
const currentPage = ref(1);
const itemsPerPage = ref(11);
const tableMetaData = ref<{ total: number; pages: number } | null>(null);
const totalLogs = computed(() =>
  tableMetaData.value ? tableMetaData.value.total : logs.value.length
);
const totalPages = computed(() =>
  tableMetaData.value ? tableMetaData.value.pages : 1
);

const fetchLogs = async () => {
  loading.value = true;
  fetchError.value = '';

  try {
    const result: LogTable = await logsStore.fetchLogs(
      currentPage.value,
      itemsPerPage.value,
    );

    if (result) {
      logs.value = result.data;
      tableMetaData.value = result.meta;
    } else {
      logs.value = [];
    }
  } catch (error) {
    console.error('Ошибка при загрузке логов:', error);
    fetchError.value = 'Произошла ошибка при загрузке логов';
  } finally {
    loading.value = false;
  }
};

const handleChangePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateUrlParams();
};

const isShowFilters = ref(false);

const showFilters = () => {
  isShowFilters.value = true;
}

const closeFilters = () => {
  isShowFilters.value = false;
}
const searchQuery = ref('');

const initFiltersFromUrl = () => {
  const query = route.query;

  currentPage.value = Number(query.page) || 1;
  itemsPerPage.value = Number(query.per_page) || 11;
  searchQuery.value = typeof query.search === 'string' ? query.search : '';
};

const updateUrlParams = () => {
  const query: Record<string, string | number> = {};

  if (currentPage.value > 1) query.page = currentPage.value;
  if (itemsPerPage.value !== 11) query.per_page = itemsPerPage.value;
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();

  router.replace({ query });
};

const applyFilters = () => {
  currentPage.value = 1;
  updateUrlParams();
};

const handleActionClick = (log: Log) => {
  // pass
};


onMounted(async () => {
  initFiltersFromUrl();
  await fetchLogs();
});
watch(
  () => route.query,
  async () => {

    initFiltersFromUrl();
    await fetchLogs();
  },
  { deep: true }
);
</script>

<style>

</style>