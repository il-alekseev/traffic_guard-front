  <template>
  <div class="dashboard">
    <div class="dashboard__content">
      <SidebarComponent :is-open="isSidebarOpen" @logout="logout"/>
      <main class="dashboard__main">
        <slot />
      </main>
    </div>
    <NotificationToasts />
  </div>
</template>

<script setup lang="ts">
// import { useUserStore } from '~/stores/user';
import {navigateTo} from "#app";
import NotificationToasts from "~/components/UI/NotificationToasts.vue";
import SidebarComponent from "~/components/Dashboard/SidebarComponent.vue";

const isProfileMenuOpen = ref(false);
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// const userStore = useUserStore();

// onMounted(async () => {
//   if (!userStore.user) {
//     await userStore.fetchUserInfo();
//   }
//   if (userStore.user && userStore.user?.is_need_to_change_password) {
//     return navigateTo('/change-password');
//   }
// })


// const logout = () => {
//   userStore.logout();
//   navigateTo('/auth');
// }
</script>

<style>
.dashboard {
  min-height: 100vh;
  background-color: var(--color-white-tertiary);
}

.dashboard__content {
  display: flex;
  min-height: 100%;
  position: relative;
}

.dashboard__main {
  flex: 1;
  transition: margin-left var(--transition);
  margin: 20px 20px 20px 12px;
  padding: 32px 24px 13px 24px;
  background-color: var(--color-white);
  outline: 0.8px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
}
</style>
