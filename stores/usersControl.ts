import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { User, UsersTable } from "~/types/user";
import { getTokenHeaders } from "~/helpers";
import type { UsersControlState } from "~/types/usersControl";
import type { defaultResponse } from "~/types/api";
import { useUserStore } from "./user";

export const useUsersControlStore = defineStore("userControl", {
  state: (): UsersControlState => {
    return {
      users: null,
    };
  },

  getters: {
    // users: (state) => state.users,
  },

  actions: {
    async fetchUsers(page: number = 1, limit: number = 10, search?: string, role?: string, ): Promise<UsersTable> {
      const usersTablePage1: UsersTable = {
        data: [
          {
            user_id: "1",
            login: "ivanov_aa",
            email: "ivanov.aa@example.com",
            first_name: "Алексей",
            last_name: "Иванов",
            patronymic: "Андреевич",
            role: "admin",
            area: "Москва",
            is_super_admin: true,
            created_at: "2023-01-12T10:15:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "2",
            login: "petrova_ev",
            email: "petrova.ev@example.com",
            first_name: "Екатерина",
            last_name: "Петрова",
            patronymic: "Викторовна",
            role: "user",
            area: "Санкт-Петербург",
            is_super_admin: false,
            created_at: "2023-02-05T09:00:00Z",
            is_need_to_change_password: true,
          },
          {
            user_id: "3",
            login: "sidorov_pm",
            email: "sidorov.pm@example.com",
            first_name: "Павел",
            last_name: "Сидоров",
            patronymic: "Михайлович",
            role: "moderator",
            area: "Новосибирск",
            is_super_admin: false,
            created_at: "2023-03-11T14:30:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "4",
            login: "smirnova_oa",
            email: "smirnova.oa@example.com",
            first_name: "Ольга",
            last_name: "Смирнова",
            patronymic: "Александровна",
            role: "user",
            area: "Екатеринбург",
            is_super_admin: false,
            created_at: "2023-04-01T11:45:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "5",
            login: "volkov_ia",
            email: "volkov.ia@example.com",
            first_name: "Игорь",
            last_name: "Волков",
            patronymic: "Алексеевич",
            role: "user",
            area: "Казань",
            is_super_admin: false,
            created_at: "2023-04-21T08:10:00Z",
            is_need_to_change_password: true,
          },
          {
            user_id: "6",
            login: "novikova_ma",
            email: "novikova.ma@example.com",
            first_name: "Мария",
            last_name: "Новикова",
            patronymic: "Андреевна",
            role: "moderator",
            area: "Самара",
            is_super_admin: false,
            created_at: "2023-05-18T16:25:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "7",
            login: "egorov_nv",
            email: "egorov.nv@example.com",
            first_name: "Николай",
            last_name: "Егоров",
            patronymic: "Васильевич",
            role: "user",
            area: "Ростов-на-Дону",
            is_super_admin: false,
            created_at: "2023-06-09T12:00:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "8",
            login: "fedorova_is",
            email: "fedorova.is@example.com",
            first_name: "Ирина",
            last_name: "Федорова",
            patronymic: "Сергеевна",
            role: "user",
            area: "Уфа",
            is_super_admin: false,
            created_at: "2023-07-01T09:40:00Z",
            is_need_to_change_password: true,
          },
          {
            user_id: "9",
            login: "kuznetsov_av",
            email: "kuznetsov.av@example.com",
            first_name: "Андрей",
            last_name: "Кузнецов",
            patronymic: "Владимирович",
            role: "admin",
            area: "Красноярск",
            is_super_admin: false,
            created_at: "2023-08-15T13:50:00Z",
            is_need_to_change_password: false,
          },
          {
            user_id: "10",
            login: "morozova_ek",
            email: "morozova.ek@example.com",
            first_name: "Елена",
            last_name: "Морозова",
            patronymic: "Константиновна",
            role: "user",
            area: "Воронеж",
            is_super_admin: false,
            created_at: "2023-09-10T07:30:00Z",
            is_need_to_change_password: true,
          },
          {
            user_id: "11",
            login: "morozova_ek",
            email: "morozova.ek@example.com",
            first_name: "Елена",
            last_name: "Морозова",
            patronymic: "Константиновна",
            role: "user",
            area: "Воронеж",
            is_super_admin: false,
            created_at: "2023-09-10T07:30:00Z",
            is_need_to_change_password: true,
          },
        ],
        meta: {
          limit: 11,
          page: 1,
          pages: 12,
          total: 132,
        },
      };

      return usersTablePage1;

      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить список пользователей. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить список пользователей. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const params: Record<string, string | number> = {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(role ? { role } : {})
        };

        const users = await $api.get<UsersTable>('/users', {
          params,
          ...getTokenHeaders(token)
        });


        if (users) {
          this.users = users.data;
          return users;
        } else {
          throw new Error("Не удалось получить список пользователей");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при получении списка пользователей");
      }
    },

    async createUser(user:  Partial<User>): Promise<User>  {
      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось создать пользователя. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось создать пользователя. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();
        const dataToSend = { ...user };
        const createdUser = await $api.post<User>(
          `/users`,
          dataToSend,
          getTokenHeaders(token)
        );
        if (createdUser) {
          return createdUser;
        } else {
          throw new Error("Не удалось создать пользователя");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при создании пользователя");
      }
    },

    addUser(user: User) {
      this.users?.push(user);
    },

    async updateUserInfo(userId: string, userData: Partial<User>): Promise<boolean> {
      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось обновить данные пользователя. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось обновить данные пользователя. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();
        const dataToSend = { ...userData };

        const response = await $api.put<defaultResponse>(
          `/users/${userId}`,
          dataToSend,
          getTokenHeaders(token)
        );

        if (response) {
          return true;
        } else {
          throw new Error("Не удалось обновить данные пользователя");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при обновлении данных пользователя");
      }
    },

    updateUser(user: User) {
      const userToChange = this.users?.find((u) => u.user_id === user.user_id);
      if (userToChange) {
        Object.assign(userToChange, user);
      }
    },

    async resetPassword(userId: string, password: string): Promise<boolean> {
      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось обновить данные пользователя. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось обновить данные пользователя. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const data = {
          new_password: password,
        };

        const updatedUser = await $api.put<defaultResponse>(
          `/users/${userId}/pass/otp`,
          data,
          getTokenHeaders(token)
        );

        if (updatedUser) {
          return true;
        } else {
          throw new Error("Не удалось обновить данные пользователя");
        }
      } catch (error: any) {
        throw new Error(error.message || "Не удалось обновить данные пользователя");
      }
    },

    async deleteUser(userId: string): Promise<boolean> {
      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось удалить пользователя. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось удалить пользователя. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const deletedUser = await $api.delete<defaultResponse>(
          `/users/${userId}`,
          getTokenHeaders(token)
        );

        if (deletedUser) {
          return true;
        } else {
          throw new Error("Не удалось удалить пользователя");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при удалении пользователя");
      }
    },

    removeUser(userId: string) {
      this.users = (this.users ?? []).filter((u) => u.user_id !== userId);
    },

  },
});
