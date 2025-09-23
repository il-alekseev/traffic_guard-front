<template>
  <div class="sessions-page">
    <div class="sessions__header">
      <h1 class="sessions__title page-title">Сессии</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});
</script>

<style>

</style>