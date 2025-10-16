<template>
  <div class="users-page">
    <div class="users__header">
      <h1 class="users__title page-title">Управление пользователями</h1>
      <div class="users__toolbar">
        <BaseSearch
          v-model="searchQuery"
          class="users__search"
          placeholder="Поиск"
          @search="applyFilters"
        />
        <FilterButton @click="console.log('openFilter')"/>
        <BaseButton
          @click.stop="openCreateUserModal"
          type="button"
          variant="primary"
          class="users__create-button">
          <template #icon>
            <PlusIcon />
          </template>
          Создать пользователя
        </BaseButton>
      </div>
    </div>

    <ErrorBlock v-if="fetchError !== ''" :fetch-error="fetchError" />

    <div v-if="fetchError === ''"  class="users__table-container" ref="tableRef">
      <table class="users__table">
        <thead>
          <tr>
            <th class="users__table-column users__table-column-id">ID</th>
            <th class="users__table-column users__table-column-login">Логин</th>
            <th class="users__table-column users__table-column-role">Роль</th>
            <th class="users__table-column users__table-column-full-name">ФИО</th>
            <th class="users__table-column users__table-column-email">Email</th>
            <th class="users__table-column users__table-column-button th-button"></th>
          </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="6" class="users__loading">
            Загрузка пользователей...
          </td>
        </tr>
        <tr v-else-if="users.length === 0">
          <td colspan="6" class="users__empty">
            Пользователи не найдены
          </td>
        </tr>
        <template v-else>
          <tr v-for="(user, _index) in users" :key="user.user_id" class="users__table-row">
            <td class="users__table-cell-id">{{ user.user_id }}</td>
            <td class="users__table-cell-login">{{ user.login }}</td>
            <td class="users__table-cell-role">{{ user.role }}</td>
            <td class="users__table-cell-full-name">{{ user?.last_name + ' ' + user?.first_name + ' ' + (user?.patronymic || '') }}</td>
            <td class="users__table-cell-email">{{ user.email }}</td>
            <td class="td-button" @click.stop="openEditUserModal(user)">
              <button
                class="users__action-button users__action-button--edit"
                title="Редактировать"
              >
                <EditDataIcon class="users__action-icon" />
              </button>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
      <div v-if="fetchError == ''" class="users__footer">
        <div class="users__info">
          <p>Показано от {{ startIndex }} до {{ endIndex }} из {{ totalUsers }} результатов</p>
        </div>
        <div class="users__pagination">
          <div
            class="users__pagination-item users__pagination-back"
            :class="currentPage === 1 ? 'users__pagination-item_disabled' : ''"
            @click="currentPage !== 1 ? changePage(currentPage - 1) : null"
          >
            <ArrowLeftIcon class="arrow-icon" />
          </div>

          <div
            v-for="(page, index) in pagesToShow"
            :key="index"
            class="users__pagination-item"
            :class="[
              page === currentPage ? 'users__pagination-item_active' : '',
              page === '...' ? 'users__pagination-item_dots' : ''
            ]"
            @click="typeof page === 'number' ? changePage(page) : handleDotsClick(index === 1 ? 'left' : 'right')"
          >
            {{ page }}
          </div>

          <div
            class="users__pagination-item users__pagination-next"
            :class="currentPage === totalPages ? 'users__pagination-item_disabled' : ''"
            @click="currentPage !== totalPages ? changePage(currentPage + 1) : null"
          >
            <ArrowLeftIcon class="arrow-icon" />
          </div>
        </div>
      </div>
    </div>

    <SideModal
      v-model="showCreateUserModal"
      title="Создать пользователя"
      @close="closeCreateUserModal"
    >
      <ManageUserForm
        :manageType="'create'"
        :user-data="null"
        @close="closeCreateUserModal"
        @success="manageUser"
      />
    </SideModal>

    <SideModal
      v-model="showEditUserModal"
      title="Редактировать пользователя"
      @close="closeEditUserModal"
    >
      <ManageUserForm
        :manageType="'update'"
        :userData="selectedUser"
        @close="closeEditUserModal"
        @success="manageUser"
        @resetPassword="handlePasswordReset"
        @deleteUser="handleUserDeleted"
      />
    </SideModal>

    <TempPasswordUserModal
      v-if="showTempPasswordUserModal"
      :user="selectedUser"
      :password="tempPassword"
      :type="tempPasswordType"
      @close="closeTempPasswordUserModal"
    />
  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from '#imports';
import { useUsersControlStore } from '~/stores/usersControl';
import { useUserStore } from '~/stores/user';
import type { User, UsersTable } from '~/types/user';
import BaseSearch from '~/components/UI/BaseSearch.vue';
import BaseButton from '~/components/UI/BaseButton.vue';
import SideModal from '~/components/UI/SideModal.vue';
import ManageUserForm from '~/components/users/ManageUserForm.vue';
import TempPasswordUserModal from '~/components/users/TempPasswordUserModal.vue';
import FilterButton from '~/components/UI/FilterButton.vue';
import ErrorBlock from '~/components/UI/ErrorBlock.vue';
import PlusIcon from "~/assets/img/plus.svg";
import EditDataIcon from '~/assets/img/edit.svg';
import ArrowLeftIcon from "~/assets/img/arrow-left.svg"


definePageMeta({
  layout: 'dashboard',
  // middleware: ['auth']
});

const route = useRoute();
const router = useRouter();

const usersControlStore = useUsersControlStore();
const userStore = useUserStore();

const loading = ref(true);
const fetchError = ref('');

const selectedUser = ref<User | null>(null);
const tempPassword = ref('');
const showCreateUserModal = ref(false);
const showEditUserModal = ref(false);
const showTempPasswordUserModal = ref(false);
const tempPasswordType = ref<'create' | 'reset'>('create')

const users = ref<User[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(11);
const tableMetaData = ref<{ total: number; pages: number } | null>(null);
const totalUsers = computed(() =>
  tableMetaData.value ? tableMetaData.value.total : users.value.length
);
const totalPages = computed(() =>
  tableMetaData.value ? tableMetaData.value.pages : 1
);
const pagesToShow = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, '...', total - 2, total - 1, total)
    } else if (current >= total - 2) {
      pages.push(1, 2, '...', total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})
const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});
const endIndex = computed(() => {
  const end = currentPage.value * itemsPerPage.value;
  return end > totalUsers.value ? totalUsers.value : end;
});

const searchQuery = ref('');


const fetchUsers = async () => {
  loading.value = true;
  fetchError.value = '';

  try {
    const result: UsersTable = await usersControlStore.fetchUsers(
      currentPage.value,
      itemsPerPage.value,
      searchQuery.value,
    );

    if (result) {
      users.value = result.data;
      tableMetaData.value = result.meta;
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    fetchError.value = 'Произошла ошибка при загрузке пользователей';
  } finally {
    loading.value = false;
  }
};

const toggleLockBodyScroll = (isLock: boolean) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
  isLock 
    ? document.body.classList.add('no-scroll')
    : document.body.classList.remove('no-scroll')
}

const openCreateUserModal = () => {
  toggleLockBodyScroll(true);
  selectedUser.value = null;
  showCreateUserModal.value = true;
};

const closeCreateUserModal = () => {
  toggleLockBodyScroll(false);
  showCreateUserModal.value = false;
};

const handleUserCreated = (newUser: User, password: string) => {
  usersControlStore.addUser(newUser);
  closeCreateUserModal();
  openTempPasswordUserModal(newUser, password, 'create');
};

const openEditUserModal = (user: User) => {
  toggleLockBodyScroll(true);
  selectedUser.value = { ...user };
  showEditUserModal.value = true;
};

const closeEditUserModal = () => {
  toggleLockBodyScroll(false);
  selectedUser.value = null;
  showEditUserModal.value = false;
};

const handleUserUpdated = async (updatedUser: User) => {
  const userIndex = users.value.findIndex((u) => u.user_id === updatedUser.user_id);
  if (userIndex !== -1) {
    users.value[userIndex] = updatedUser;
  } else {
    await fetchUsers();
  }
  closeEditUserModal();
};

const manageUser = (opType: 'create' | 'update', user: User, password: string | null) => {
  if (opType === 'create' && user && password !== null) {
    handleUserCreated(user, password)
  } else if (opType === 'update' && user) {
    handleUserUpdated(user)
  } else return;
}

const handlePasswordReset = (userId: string, password: string) => {
  const user: User | undefined = users.value.find(u => u.user_id === userId);
  if (!user) return;
  openTempPasswordUserModal(user, password, 'reset');
};

const openTempPasswordUserModal = (user: User, password: string, tempPassType: 'create' | 'reset') => {
  toggleLockBodyScroll(true);
  selectedUser.value = { ...user };
  tempPassword.value = password;
  showTempPasswordUserModal.value = true;
  tempPasswordType.value = tempPassType;
};

const closeTempPasswordUserModal = () => {
  toggleLockBodyScroll(false);
  selectedUser.value = null;
  tempPassword.value = '';
  showTempPasswordUserModal.value = false;
};

const handleUserDeleted = (userId: string) => {
  closeEditUserModal();
  users.value = users.value.filter(u => u.user_id !== userId);
  usersControlStore.removeUser(userId);
};

const handleDotsClick = (dotsPosition: 'left' | 'right') => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (dotsPosition === 'left') {
    changePage(Math.max(1, current - 3));
  } else {
    changePage(Math.min(total, current + 3));
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  updateUrlParams();
};

const initFiltersFromUrl = async () => {
  const query = route.query;

  currentPage.value = Number(query.page) || 1;
  itemsPerPage.value = Number(query.per_page) || 11;
  searchQuery.value = typeof query.search === 'string' ? query.search : '';
};

const updateUrlParams = () => {
  const query: Record<string, string | number> = {};

  if (currentPage.value > 1) query.page = currentPage.value;
  if (itemsPerPage.value !== 11) query.per_page = itemsPerPage.value;
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();

  router.replace({ query });
};

const applyFilters = () => {
  currentPage.value = 1;
  updateUrlParams();
};

onMounted(async () => {
  await initFiltersFromUrl();
  await fetchUsers();
});
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    const withoutCreate = (q: typeof newQuery) => {
      const { create, ...rest } = q;
      return JSON.stringify(rest);
    };

    if (withoutCreate(newQuery) === withoutCreate(oldQuery)) {
      return;
    }

    initFiltersFromUrl();
    await fetchUsers();
  },
  { deep: true }
);

</script>

<style scoped>
.users__header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.users__title {
  min-width: 27rem;
}

.users__toolbar {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}

.users__search {
  max-width: 47.25rem;
  min-width: 16rem;
  width: 100%;
}

.users__create-button {
  width: 14.5rem;
}

.users__table-container {
  overflow-x: auto;
  background-color: #FFFFFF;
  border-radius: 1.75rem;
  min-height: calc(100vh - 15rem);
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
}

.users__table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.users__table td,
.users__table th {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.users__table td.td-button {
  overflow: visible;
}

.users__table th {
  text-align: left;
  padding: 0.90625rem 0.75rem;
  font-weight: 600;
  color: #3F3F46;
  border-bottom: 1px solid #E4E4E7;
  line-height: 1.25rem;
  font-size: 1rem;
  max-width: 18.6875rem;
}

.users__table td {
  padding: 1rem 0.75rem;
  padding-right: 0px;
  border-bottom: 1px solid #E4E4E7;
  color: #71717A;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
  max-width: 16.6875rem;
}

td.td-button {
  position: relative;
  padding: 0;
}

.users__loading,
.users__empty {
  text-align: center;
  padding: 2rem;
  color: #3F3F46;
}

.users__action-button {
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
}

.users__action-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563EB;
}

td.users__table-cell-login {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #3F3F46;
}
td.users__table-cell-email {
  color: #2563EB;
}

.users__table-column-id {
  width: 10%;
}
.users__table-column-login {
  width: 15%
}
.users__table-column-role {
  width: 10%
}
.users__table-column-full-name {
  width: 27%;
}
.users__table-column-email {
  width: 28%;
}
.users__table-column-button {
  width: 10%;
}

.users__footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.users__info {
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #3F3F46;
}

.users__pagination {
  display: flex;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.users__pagination-item {
  cursor: pointer;
  min-width: 2.5rem;
  height: 2.25rem;
  background: #FFFFFF;
  outline: 1px solid #E4E4E7;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #3F3F46;
}

.users__pagination-item_active {
  background: #2563EB;
  outline: 1px solid #2563EB;
  color: #FFFFFF;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #A1A1AA;
}

.users__pagination-next .arrow-icon {
  transform: scaleX(-1);
}

.users__pagination-item_disabled {
  cursor: not-allowed;
}

</style>