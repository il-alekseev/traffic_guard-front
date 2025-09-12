<template>
  <transition name="slide-fade">
    <div v-if="modelValue" class="side-modal">
      <div class="side-modal__overlay"></div>
      <div class="side-modal__content">
        <div class="side-modal__header">
          <div class="side-modal__title-container">
            <h2 class="side-modal__title">{{ title }}</h2>
            <span class="side-modal__steps" v-if="maxStep !== '' && maxStep !== undefined && currentStep !== '' && currentStep !== undefined">{{ currentStep }}/{{ maxStep }}</span>
          </div>
          
          <CrossIcon class="side-modal__close" @click="emit('close')" />
        </div>

        <div class="side-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import CrossIcon from '@/assets/img/cross.svg'

defineProps<{
  modelValue: boolean
  title: string
  currentStep?: string;
  maxStep?: string;
}>()

const emit = defineEmits(['close']);
</script>

<style scoped>
.side-modal {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  justify-content: flex-end;
}
.side-modal__overlay {
  position: absolute;
  inset: 0;
  background: transparent;
}
.side-modal__content {
  position: relative;
  width: 500px;
  height: calc(100vh - 15px);
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 15px;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0px 8px 8px rgba(0, 32, 51, 0.04), 0px 12px 28px rgba(0, 32, 51, 0.12);
}
.side-modal__header {
  padding: 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-secondary);
}
.side-modal__title-container {
  display: flex;
  gap: 12px;
  align-items: center;
}
.side-modal__title {
  font-weight: 600;
  font-size: var(--font-size-3xl);
  line-height: 34px;
  color: var(--color-typo-primary);
}
.side-modal__steps {
  font-weight: 600;
  font-size: var(--font-size-3xl);
  line-height: 34px;
  color: var(--color-typo-placeholder);
}
.side-modal__body {
  padding: 24px 16px;
  overflow-y: auto;
  flex: 1;
  height: 100%;
}
.side-modal__close {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
  color: var(--color-typo-secondary);
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
