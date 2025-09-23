<template>
  <div class="header">
    <div class="header__content">
      <div class="header__user">
        <div class="header__user-avatar">
          <UserCircleIcon />
        </div>
        <div class="header__user-info">
          <p class="header__user-name">{{ fullName }}</p>
        </div>
        <div class="header__user-arrow"  @click="toggleIsMenuOpen">
          <ArrowIcon />
        </div>
        <div
          v-if="isMenuOpen"
          class="header__user-menu">
          <ul>
            <li>
              <NuxtLink to="/profile/edit">
                <span class="header__user-menu-link">Профиль</span>
              </NuxtLink>
            </li>
            <li @click="emit('logout')">
              <span class="header__user-menu-link">Выход</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import UserCircleIcon from "~/assets/img/user-circle.svg";
import ArrowIcon from "~/assets/img/arrow-down.svg";


const emit = defineEmits(['logout']);

const userStore = useUserStore();

const fullName = computed(() => {
    if (userStore.firstName && userStore.lastName) return userStore.fullName;
    return 'Иванов Павел'
})

const isMenuOpen = ref(false);

const toggleIsMenuOpen = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

</script>

<style>
.header {
  height: 64px;
  position: sticky;
  background-color: #FFFFFF;
}

.header__content {
  width: 100%;
  padding-inline: 2rem;
  padding-block: 1rem;
  display: flex;
  justify-content: flex-end;  
}

.header__user {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
}

.header__user-avatar {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__user-avatar img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header__user-name {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #3F3F46;
}

.header__user-arrow {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header__user-arrow img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.header__user-menu {
  position: absolute;
  top: 48px;
  right: 0;
  background-color: #FFFFFF;
  padding: 0.5rem;
  padding-inline: 1rem;
  border-radius: 0.375rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.header__user-menu ul {
  list-style-type:  none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header__user-menu-link {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #3F3F46;
  text-decoration: none;
}

.header__user-menu li {
  cursor: pointer;
}

.header__user-menu li a{
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #3F3F46;
  text-decoration: none;
}

</style>