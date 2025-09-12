<template>
  <aside :class="['sidebar', { 'sidebar--closed': !isOpen }]">
    <div class="sidebar__logo">
      <NuxtLink to="/dashboard" class="sidebar__logo-link">
        Fazenda
      </NuxtLink>
    </div>
    <div class="sidebar__content">
      <nav class="sidebar__nav">
        <template v-for="item in menuItems" :key="item.label">
          <NuxtLink
            v-if="!item.external"
            :to="item.to"
            class="sidebar__item"
            :class="{ 'sidebar__item--active': $route.path === item.to }"
          >
            <div v-if="item.iconComponent" class="sidebar__item-icon">
              <component :is="item.iconComponent" class="sidebar__item-icon-img" />
            </div>
            <p class="sidebar__item-link">{{ item.label }}</p>
          </NuxtLink>
          <a
            v-else
            :href="item.href"
            class="sidebar__item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div v-if="item.iconComponent" class="sidebar__item-icon">
              <component :is="item.iconComponent" class="sidebar__item-icon-img" />
            </div>
            <p class="sidebar__item-link">{{ item.label }}</p>
          </a>
        </template>
      </nav>
    </div>
    <div class="sidebar__footer">
      <NuxtLink
        :class="['sidebar__user', { 'sidebar__item--active': $route.path === '/profile/edit' }]"
        to="/profile/edit"
      >
        <div class="sidebar__user-avatar">
          <UserCircleIcon />
        </div>
        <div class="sidebar__user-info">
          <p class="sidebar__user-name">{{ userStore.fullName }}</p>
        </div>
      </NuxtLink>
      <div class="sidebar__extra">
        <div class="sidebar__toggle" @click="emit('logout')">
          <div class="sidebar__toggle-button">
            <HideSidebarIcon />
          </div>
          <p>Выйти</p>
        </div>
        <div class="sidebar__info">
          <p>v.1.0.0.1</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useSidebarMenu } from '~/composables/useSidebarMenu';
import UserCircleIcon from '~/assets/img/user-circle.svg';
import HideSidebarIcon from '~/assets/img/hide-sidebar.svg';
import { computed } from 'vue';

const emit = defineEmits(['logout']);

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});

const userStore = useUserStore();
const { getMenuForRole } = useSidebarMenu();

const role = computed(() => userStore.role);
const menuItems = computed(() => getMenuForRole(role.value));
// const menuItems = computed(() => getMenuForRole('KSF'));
</script>

<style>
.sidebar {
  width: 255px;
  height: 100vh;
  position: sticky;
  top: 0;
  background-color: var(--color-white-tertiary);
  display: flex;
  flex-direction: column;
  padding-inline: var(--size-3);
  z-index: 5;
  overflow: hidden;
}

.sidebar--closed {
  width: 0;
  margin-left: -256px;
}

@media (min-width: 768px) {
  .sidebar--closed {
    margin-left: 0;
  }
}

.sidebar__logo {
  padding-top: 21px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-tertiary);
}

.sidebar__logo-link {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.sidebar__logo-img {
  height: 20px;
  width: auto;
}

.sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--size-4) 0;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: 7px 12px 7px 8px;
  transition: all var(--transition-fast);
  border-left: 2px solid transparent;
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.sidebar__item:hover {
  background: var(--color-gray-active);
}

.sidebar__item--active {
  background: var(--color-gray-active);
  border-left: 2px solid var(--color-blue-accent);
  border-radius: var(--radius-sm);
}

.sidebar__item-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-typo-placeholder);
}

.sidebar__item--active .sidebar__item-icon {
  color: var(--color-blue-accent);
}

.sidebar__item-icon img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  
}

.sidebar__item-link {
  font-size: var(--font-size-xs);
  line-height: 18px;
  font-weight: 400;
  color: var(--color-typo-primary);
  text-decoration: none;
}


.router-link-active {
  border-left-color: var(--color-blue-main);
}

.sidebar__footer {
  padding-block: var(--size-4);
  border-top: 1px solid var(--color-border-tertiary);
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
  margin-top: auto;
}

.sidebar__user {
  display: flex;
  gap: var(--size-3);
  align-items: center;
  cursor: pointer;
  padding: 7px 12px 7px 8px;
  text-decoration: none;
}

.sidebar__user-avatar {
  width: 16px;
  height: 16px;
  color: var(--color-typo-placeholder);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar__user-info {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-xs);
  line-height: 18px;
  font-weight: 400;
  color: var(--color-typo-primary);
  text-decoration: none;
}

.sidebar__extra {
  display: flex;
  justify-content: space-between;
  padding: 7px 12px 7px 8px;
}

.sidebar__toggle {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  cursor: pointer;
}

.sidebar__toggle p {
  font-size: var(--font-size-xs);
  line-height: 18px;
  font-weight: 400;
  color: var(--color-typo-primary);
  text-decoration: none;
}

.sidebar__toggle-button {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-typo-placeholder);
}

.sidebar__info p {
  font-size: var(--font-size-xs);
  line-height: 18px;
  font-weight: 400;
  color: var(--color-typo-primary);
  text-decoration: none;
}
</style>
