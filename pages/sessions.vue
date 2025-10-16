<template>
  <div class="sessions-page">
    <div class="sessions__header">
      <h1 class="sessions__title page-title">Подозрительные сессии</h1>
      <div class="sessions__toolbar">
        <BaseSearch
          v-model="searchQuery"
          class="sessions__search"
          placeholder="Поиск"
          @search="applyFilters"
        />
        <FilterButton @click="console.log('openFilter')"/>
      </div>
    </div>

    <ErrorBlock v-if="fetchError !== ''" :fetch-error="fetchError" />

    <BaseTable
      :items="sessions"
      :columns="columns"
      :loading="loading"
      :fetch-error="fetchError"
      :total-items="totalSessions"
      :total-pages="totalPages"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      prefix="sessions"
      @page-change="handleChangePage"
      @action-click="handleActionClick"
    >
      <template #cell-status="{ value }">
        <span :class="getBadgeClassByStatus(value)">
          {{ getStatusText(value) }}
        </span>
      </template>
      <template #cell-ngfw="{ value }">
        <span :class="getNgfwBadgeClass(value)">
          {{ value }}
        </span>
      </template>
      <template #cell-url="{ value }">
        <span class="sessions__table-cell-url">{{ value }}</span>
      </template>
      <template #cell-full_name="{ value, item }">
        <span class="sessions__table-cell-full-name">
          {{ value || item.ip || '—' }}
        </span>
      </template>
      <template #cell-type="{ value }">
        <span class="sessions__table-cell-type">{{ value }}</span>
      </template>
      <template #cell-category="{ value }">
        <span class="sessions__table-cell-category">{{ value }}</span>
      </template>
      <template #cell-datetime="{ value }">
        <span class="sessions__table-cell-datetime">{{ value }}</span>
      </template>
      <template #action-button="{ item }">
        <ContextMenuDotsIcon class="table__action-icon sessions__action-icon" />
      </template>
    </BaseTable>

  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import type { Session, SessionTable } from '~/types/sessionControl';
import { useSessionsControlStore } from '~/stores/sessionControl';
import { getBadgeClassByStatus, getStatusText, getNgfwBadgeClass } from '~/helpers/index';
import BaseSearch from '~/components/UI/BaseSearch.vue';
import FilterButton from '~/components/UI/FilterButton.vue';
import ErrorBlock from '~/components/UI/ErrorBlock.vue';
import BaseTable from '~/components/UI/BaseTable.vue';
import ContextMenuDotsIcon from '~/assets/img/context-menu-btn.svg';


definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});

const route = useRoute();
const router = useRouter();

const sessionsControlStore = useSessionsControlStore();

const loading = ref(true);
const fetchError = ref('');

const sessions = ref<Session[]>([]);
const columns = [
  { key: 'status', label: 'Статус' },
  { key: 'url', label: 'URL' },
  { key: 'ip', label: 'IP' },
  { key: 'ngfw', label: 'NGFW' },
  { key: 'full_name', label: 'ФИО' },
  { key: 'type', label: 'Тип' },
  { key: 'category', label: 'Категория' },
  { key: 'datetime', label: 'Дата и время' },
];
const currentPage = ref(1);
const itemsPerPage = ref(11);
const tableMetaData = ref<{ total: number; pages: number } | null>(null);
const totalSessions = computed(() =>
  tableMetaData.value ? tableMetaData.value.total : sessions.value.length
);
const totalPages = computed(() =>
  tableMetaData.value ? tableMetaData.value.pages : 1
);

const searchQuery = ref('');

const fetchSessions = async () => {
  loading.value = true;
  fetchError.value = '';

  try {
    const result: SessionTable = await sessionsControlStore.fetchSessions(
      currentPage.value,
      itemsPerPage.value,
      searchQuery.value,
    );

    if (result) {
      sessions.value = result.data;
      tableMetaData.value = result.meta;
    } else {
      sessions.value = [];
    }
  } catch (error) {
    console.error('Ошибка при загрузке сессий:', error);
    fetchError.value = 'Произошла ошибка при загрузке сессий';
  } finally {
    loading.value = false;
  }
};

const handleChangePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateUrlParams();
};

const handleActionClick = (session: Session) => {
  console.log('Action clicked for session:', session);
};


const initFiltersFromUrl = async () => {
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

onMounted(async () => {
  await initFiltersFromUrl();
  await fetchSessions();
});
watch(
  () => route.query,
  async () => {

    initFiltersFromUrl();
    await fetchSessions();
  },
  { deep: true }
);
</script>

<style scoped>
.sessions__header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.sessions__title {
  min-width: 23rem;
}

.sessions__toolbar {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}

.sessions__search {
  max-width: 66.625rem;
  min-width: 16rem;
  width: 100%;
}

:deep(.sessions__table-cell-status span) {
  padding: 0.25rem 0.5rem;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  background: #71717a69;
  color: #3F3F46;
  border-radius: 6px;
}

:deep(.sessions__table-cell-status span.session-status-badge_greeen) {
  color: #008236;
  background-color: #DCFCE7;
}

:deep(.sessions__table-cell-status span.session-status-badge_red) {
  color: #C10007;
  background-color: #FFE2E2;
}

:deep(.sessions__table-cell-status span.session-status-badge_yellow) {
  color: #894B00;
  background-color: #FEF9C2;
}

:deep(.sessions__table-cell__badge) {
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.25rem 0.5rem;
  text-transform: uppercase;
  border-radius: 6px;
}

:deep(.sessions__table-cell__badge--ngfw-1) {
  background: #DCFCE7;
  color: #008236;
}

:deep(.sessions__table-cell__badge--ngfw-2) {
  background: #DBEAFE;
  color: #1447E6;
}

:deep(.sessions__table-cell-url),
:deep(.sessions__table-cell-category),
:deep(.sessions__table-cell-datetime) {
  color: #3F3F46;
}

:deep(.sessions__table-cell-type) {
  color: #2563EB;
}

:deep(.table__action-icon) {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563EB;
}

:deep(.sessions__table-column-status) {
  width: 7%;
}
:deep(.sessions__table-column-url) {
  width: 15%;
}
:deep(.sessions__table-column-ip) {
  width: 9%;
}
:deep(.sessions__table-column-ngfw) {
  width: 6%;
}
:deep(.sessions__table-column-fullName) {
  width: 17.5%;
}
:deep(.sessions__table-column-type) {
  width: 14%;
}
:deep(.sessions__table-column-category) {
  width: 13.5%;
}
:deep(.sessions__table-column-datetime) {
  width: 13.5%;
}
:deep(.sessions__table-column-button) {
  width: 5%;
}
</style>