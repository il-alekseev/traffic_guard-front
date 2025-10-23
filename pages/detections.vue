<template>
  <div class="detections-page">
    <div class="detections__header">
      <StatsComponent :stats="mockStats" />
      <div class="detections__header-block">
        <div class="detections__header-title-block">
          <h1 class="detections__title page-title">У вас 5 нерешенных выявлений</h1>
          <div class="detections__subtitle-block page-subtitle-block">
            <p class="detections__subtitle page-subtitle">Обновлено 5 мин назад</p>
            <div class="detections__refresh-btn page-refresh-btn">
              <ReloadIcon />
            </div>
          </div>
        </div>
        <div class="detections__filters">
          <div class="detections__datepicker-container">
            <DatePicker v-model="dateRange" />
          </div>
          <button class="detections__filter-button">
            <div class="detections__filter-button-icon">
              <FilterIcon />
            </div>
            <span class="detections__filter-button-text">Фильтр</span>
            <div class="detections__filter-selected-area">
              <span :class="['resource-card__badge resource-card__badge_small', `resource-card__badge--ngfw-2`]">
                NGFW-2
              </span>
              <span :class="['resource-card__badge resource-card__badge_small', `resource-card__badge--ngfw-1`]">
                NGFW-1
              </span>
            </div>
          </button>
          <DownloadButton />
        </div>
      </div>

    </div>
    <div class="resources-grid">
      <ResourceCard
        v-for="resource in mockResources" 
        :item="resource"
        @confirm="handleConfirm(resource.id)"
        @reject="handleReject(resource.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import StatsComponent from '~/components/DataDisplay/StatsComponent.vue';
import type { Resource, StatItem } from '~/types/statistics';
import ReloadIcon from "~/assets/img/reload.svg"
import FilterIcon from "~/assets/img/filter-icon.svg"
import ResourceCard from '~/components/ResourceCards/ResourceCard.vue';
import DatePicker from '~/components/UI/DatePicker.vue';
import DownloadButton from '~/components/UI/DownloadButton.vue';

definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});

const dateRange = ref<{ start: Date | null; end: Date | null }>({
  start: new Date(2025, 7, 1),
  end: new Date(2025, 8, 1)
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const mockStats: StatItem[] = [
  {
    name: 'Количество выявлений',
    stat: '132',
    previousStat: '116',
    change: '12%',
    changeType: 'increase',
  },
  {
    name: 'Разрешено',
    stat: '5',
    previousStat: '4',
    change: '1%',
    changeType: 'increase',
  },
  {
    name: 'Заблокировано',
    stat: '95',
    previousStat: '100',
    change: '5%',
    changeType: 'decrease',
  },
]

const mockResources = ref<Resource[]>([
  {
    id: 1,
    name: 'CorgiSecret-1x.dog',
    category: 'Экстремизм',
    date: '24.09.2025, 09:54',
    description: 'Агрессия, расизм, терроризм',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-2',
    requestCount: 26,
    status: 'blocking',
    isBlocked: false
  },
  {
    id: 2,
    name: 'CorgiSecret-1x.dog',
    category: 'Наркотики',
    date: '24.09.2025, 09:54',
    description: 'Зеркало заблокированного ресурса',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-2',
    requestCount: 10,
    status: 'verification',
    isBlocked: false
  },
  {
    id: 3,
    name: 'CorgiSecret-1x.dog',
    category: 'Экстремизм',
    date: '24.09.2025, 09:54',
    description: 'Прокси и анонимайзеры',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-1',
    requestCount: 12,
    status: 'blocking',
    isBlocked: false
  },
  {
    id: 4,
    name: 'CorgiSecret-1x.dog',
    category: 'Экстремизм',
    date: '24.09.2025, 09:54',
    description: 'Реестр запрещенных сайтов',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-1',
    requestCount: 26,
    status: 'blocking',
    isBlocked: false
  },
  {
    id: 5,
    name: 'CorgiSecret-1x.dog',
    category: 'Наркотики',
    date: '24.09.2025, 09:54',
    description: 'Азартные игры',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-1',
    requestCount: 10,
    status: 'verification',
    isBlocked: false
  },
  {
    id: 6,
    name: 'CorgiSecret-1x.dog',
    category: 'Наркотики',
    date: '24.09.2025, 09:54',
    description: 'Интернет-магазины',
    country: 'Россия',
    location: 'Раменский',
    ipAddress: '89.151.191.14',
    ngfw: 'ngfw-2',
    requestCount: 10,
    status: 'verification',
    isBlocked: true
  }
])

const handleConfirm = (id: number) => {
  console.log('Подтверждено:', id)
}

const handleReject = (id: number) => {
  console.log('Отклонено:', id)
}

</script>

<style lang="scss" scoped>

.detections__header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resources-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.detections__filter-button {
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

.detections__filter-button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  color: #A1A1AA;
}

.detections__filter-button-icon svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detections__filter-button-text {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #3F3F46;
}

.detections__filter-selected-area {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.detections__filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detections__download-btn {
  padding: 0.5rem;
  background-color: #FFFFFF;
  box-shadow: 0px 1px 2px 0px #0000000D;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detections__download-btn svg {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.resource-card {
  &__badge {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    text-transform: uppercase;

    &_small {
      padding: 0.125rem 0.365rem;
    }

    &--ngfw-1 {
      background: #DCFCE7;
      color: #008236;
    }

    &--ngfw-2 {
      background: #DBEAFE;
      color: #1447E6;
    }
  }
}
</style>