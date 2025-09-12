<template>
  <div class="dashboard-page">
    <div class="dashboard__header">
      <h1 class="dashboard__title">Панель управления</h1>
    </div>

  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user'


const route = useRoute();
const router = useRouter();

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
});

const userStore = useUserStore();
const role = computed(() => userStore.role);


</script>

<style>

thead {
  position: sticky;
  z-index: 10;
}
.dashboard__header {
  margin-bottom: 14px;
}

.dashboard__title {
  font-size: var(--font-size-3xl);
  line-height: 34px;
  font-weight: 600;
  color: var(--color-typo-primary);
  margin-block: 1px;
}
</style>
