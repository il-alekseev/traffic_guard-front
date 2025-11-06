<template>
  <div class="reports-page">
    <div class="reports__generator">
      <div class="page-title">
        Генератор отчётов
      </div>
      <div class="reports__config-form">
        <ReportForm @submit="getReport" :loading="formLoading" :success="formSucces" />
      </div>
    </div>
    <div class="reports__data">
      <div class="page-title">
        Сформированные отчёты
      </div>
      <div v-if="reports.length > 0" class="reports__list">
        <ReportItem v-for="report in reports" :report="report" />
      </div>
      <div v-else class="reports__empty-block">
        <div v-if="loadingReports" class="reports__loading">
          <p>Загрузка...</p>
        </div>
        <div v-else-if="reportsFetchError !== ''" class="reports__error">
          <ErrorBlock v-if="reportsFetchError !== ''" :fetch-error="reportsFetchError" />
        </div>
        <div v-else class="reports__empty-data">
          <div class="reports__empty-img">
            <EmptyDataIcon />
          </div>
          <div class="reports__empty-title">
            <p>У вас пока нет отчетов</p>
          </div>
          <div class="reports__empty-subtitle">
            Для начала создайте свой первый отчет, используя генератор отчётов
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import { useReportsStore } from '~/stores/reports';
import ErrorBlock from '~/components/ui/ErrorBlock.vue';
import EmptyDataIcon from "~/assets/img/empty-data.svg"
import ReportForm from "~/components/reports/ReportGeneratorForm.vue"
import type { ReportFormData } from '~/types/reports';
import ReportItem from '~/components/reports/ReportItem.vue';


definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});

const reportStore = useReportsStore();

const loadingReports = ref(true);
const reportsFetchError = ref('');
const reports = ref<any[]>([]);

const fetchReports = async () => {
  loadingReports.value = false;
  console.log('fetchReports');
  // pass
}

const formLoading = ref(false);
const formError = ref('');
const formSucces = ref(false);

const getReport = async (formData: ReportFormData) => {
  console.log('getReport', formData)
  if (formData.deviceSelection === 'specific') return;

  formLoading.value = true;
  formSucces.value = false;
  formError.value = '';

  try {
    const reportData = await reportStore.fetchReportAllDevices(formData.dateFrom, formData.dateTo);
    console.log('reportData', reportData);

  } catch (error: any) {
    formError.value = error
  } finally {
    formLoading.value = false;
  }
}

onMounted( async () => {
  await fetchReports();
})

</script>

<style lang="scss">
.page-title {
  font-weight: 500;
  font-size: 1.875rem;
  line-height: 2.25rem;
  color: #3F3F46;
}

.reports-page {
  display: flex;
  gap: 1rem;
}

.reports__generator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 34%;
  width: 100%;
}

.reports__data {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 66%;
  width: 100%;
}

.reports__empty-block {
  height: 29.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 24px;
}

.reports__empty-data {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reports__empty-img {
  align-self: center;
  width: 88px;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reports__empty-img svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reports__empty-title {
  font-weight: 400;
  font-size: 2rem;
  line-height: 2.25rem;
  text-align: center;
  color: #3F3F46;
}

.reports__empty-subtitle {
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1.5rem;
  text-align: center;
  color: #A1A1AA;
}

.reports__loading {
  font-weight: 400;
  font-size: 2rem;
  line-height: 2.25rem;
  text-align: center;
  color: #3F3F46;
}

.reports__config-form {
  padding: 1.5rem;
  background-color: #FFFFFF;
  border-radius: 24px;
}

.reports__list {
  padding: 0.75rem 1.5rem;
  background-color: #FFFFFF;
  border-radius: 24px;
}


</style>