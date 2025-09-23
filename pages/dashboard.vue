<template>
  <div class="dashboard-page">
    <div class="dashboard__header">
      <h1 class="dashboard__title page-title">Панель управления</h1>
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
  // middleware: ['auth']
});

const userStore = useUserStore();
const role = computed(() => userStore.role);


</script>

<style>
</style>
