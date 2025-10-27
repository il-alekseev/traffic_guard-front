<template>
  <div class="resource-card" :class="false ? 'resource-card_transparent' : ''">
    <div class="resource-card__header">
      <div class="resource-card__title-row">
        <span class="resource-card__label">Domain</span>
      </div>
      <div class="resource-card__title-block">
        <div class="resource-card__title-icon-block">
          <DetectionsIcon class="resource-card__title-icon" />
        </div>
        <span class="resource-card__title">{{ item?.domain || 'Неизвестно' }}</span>
        <span :class="['resource-card__category', `resource-card__category--${getModificatorByCategory(item.category)}`]">
          {{ item.category || 'Неизвестно' }}
        </span>
        <span class="resource-card__date">
          {{
            new Date(item.last_access_datetime).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }}
        </span>
      </div>
    </div>

    <div class="resource-card__section">
      <div class="resource-card__label">Описание</div>
      <div class="resource-card__description">{{ item.description || '–' }}</div>
    </div>

    <div class="resource-card__section">
      <div class="resource-card__label">Host</div>
      <div class="resource-card__host">
        <div v-if="item.country !== 'private'" class="resource-card__flag-icon-block">
          <EmojiFlag :code="item.country.toLowerCase()" />
          <!-- <VueFlag :iso="item.country" class="resource-card__flag-icon" /> -->
        </div>
        <span class="resource-card__description resource-card__description-location">{{ item.country }}</span>
        <a :href="`https://${item.ip}`" class="resource-card__ip">{{ item.ip }}</a>
      </div>
      <div class="resource-card__meta">
        <span :class="['resource-card__badge', `resource-card__badge--${item.host_name}`]">
          {{ item.host_name }}
        </span>
        <span class="resource-card__requests">
          Количество обращений: <strong>{{ item.access_count }}</strong>
        </span>
      </div>
    </div>

    <div class="resource-card__footer">
      <div :class="['resource-card__status', `resource-card__status--${item.decision || ''}`]">
        <span class="resource-card__status-dot"></span>
        {{ getStatusType(item.decision) }}
      </div>
      <div v-if="item.is_blocked !== undefined && !item.is_blocked" class="resource-card__actions">
        <BaseButton
          type="button"
          variant="primary"
          extras="small"
          @click="$emit('confirm')"
        >
          Подтвердить
        </BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          extras="small"
          @click="$emit('reject')"
        >
          Отклонить
        </BaseButton>
      </div>
      <div v-else-if="item.is_blocked !== undefined && item.is_blocked" class="resource-card__blocked">
        Заблокировано
      </div>
      <div v-else>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getModificatorByCategory, getStatusType } from '~/helpers';
import BaseButton from '~/components/UI/BaseButton.vue';
import EmojiFlag from "~/components/UI/EmojiFlag.vue"
import DetectionsIcon from "~/assets/img/detections.svg"
import RussianFlagIcon from "~/assets/img/russian-flag.svg"
import type { Detection } from '~/types/detectionsControl';


interface Props {
  item: Detection
}

defineProps<Props>()

defineEmits<{
  confirm: []
  reject: []
}>()
</script>

<style scoped lang="scss">
.resource-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 1.25rem;
  box-shadow: 0px 1px 2px 0px #0000000D;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &_transparent {
    opacity: 0.5;
  }

  &__header {
    display: flex;
    flex-direction: column;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__title-icon-block {
    width: 1.25rem;
    height: 1.25rem;
    color: #FF8800;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    margin-left: 0.375rem;
    margin-right: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    color: #3F3F46;
  }

  &__label {
    color: #A1A1AA;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
  }

  &__category {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;

    &--extremism {
      background: #7C86FF1A;
      color: #7C86FF;
    }

    &--drugs {
      background: #FF64671A;
      color: #FF6467;
    }

    &-- {
      background: #f3f4f6;
      color: #6b7280;
    }
  }

  &__date {
    margin-left: auto;
    font-weight: 400;
    color: #A1A1AA;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  &__title-block {
    display: flex;
    align-items: center;
  }

  &__icon {
    color: #f97316;
    flex-shrink: 0;
  }

  &__section {
    display: flex;
    flex-direction: column;
  }

  &__description {
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5rem;
    color: #3F3F46;

    &-location {
      margin-right: 0.75rem;
    }
  }

  &__host {
    display: flex;
    align-items: center;
  }

  &__flag-icon-block {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.375rem;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__ip {
    color: #2563EB;
    text-decoration: none;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5rem;

    &:hover {
      text-decoration: underline;
    }
  }

  &__meta {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__badge {
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    text-transform: uppercase;

    &--ngfw-1 {
      background: #DCFCE7;
      color: #008236;
    }

    &--ngfw-2 {
      background: #DBEAFE;
      color: #1447E6;
    }
  }

  &__requests {
    color: #A1A1AA;
    font-size: 1rem;
    line-height: 1.5rem;

    strong {
      color: #3F3F46;
      font-weight: 600;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #E4E4E7;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;

    &--blocking {
      background: #FFE2E2;
      color: #C10007;
    }

    &--verification {
      background: #FEF9C2;
      color: #894B00;
    }

    &-- {
      background: #E7E5E4;
      color: #57534E;
    }
  }

  &__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  &__button {
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &--primary {
      background: #2563eb;
      color: white;

      &:hover {
        background: #1d4ed8;
      }
    }

    &--secondary {
      background: #f3f4f6;
      color: #374151;

      &:hover {
        background: #e5e7eb;
      }
    }
  }

  &__blocked {
    padding: 0.5rem 0.75rem;
    color: #C10007;
    background-color: #FFE2E2;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    border-radius: 6px;
  }
}
</style>