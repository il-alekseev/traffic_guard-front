<template>
  <div class="users-page">
    <div class="users__header">
      <h1 class="users__title page-title">Пользователи</h1>
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