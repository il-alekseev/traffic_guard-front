<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div v-if="$slots.image" class="modal__image">
        <slot name="image" />
      </div>

      <header v-if="$slots.header" class="modal__header">
        <slot name="header" />
      </header>

      <main v-if="$slots.main" class="modal__content">
        <slot name="main"/>
      </main>

      <div v-if="$slots.error" class="modal__error">
        <slot name="error"/>
      </div>

      <footer v-if="$slots.footer" class="modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(90, 90, 90, 0.3);
  backdrop-filter: blur(1.5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background-color: white;
  width: 100%;
  max-width: 33.5rem;
  padding: 2rem;
  box-shadow: 0px 2px 2px rgba(0, 32, 51, 0.02),
              0px 2px 8px rgba(0, 32, 51, 0.16);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: var(--size-5);
}

.modal__header {
  display: flex;
  flex-direction: column;
  gap: var(--size-3);
  align-items: center;
  text-align: center;
}

.modal__image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.75rem;
  height: 4.75rem;
  color: #002033;
  align-self: center;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal__title {
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: 500;
  color: #002033;
  margin: 0;
}

.modal__text {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
}
</style>
