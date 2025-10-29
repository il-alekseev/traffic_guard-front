import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { defaultResponse } from "~/types/api";
import { useUserStore } from "./user";
import { getTokenHeaders } from "~/helpers";
import type { Device, DeviceControlState } from "~/types/devicesControl";
import type { DashboardState, TopCategories } from "~/types/dashboard";


export const useDashboardStore = defineStore("dashboard", {
  state: (): DashboardState => {
    return {
        topCategories: null,
        topDetections: null,
        dashboardTraffic: null
    };
  },

  getters: {
    // devices: (state) => state.devices,
  },

  actions: {
    async fetchTopCategories(from: string = 'now-10m', to: string = 'now', count: number = 5, hostname?: string): Promise<TopCategories> {

      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить топ категорий. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить топ категорий. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const params: Record<string, string | number> = {
          from,
          to,
          count,
          ...(hostname ? { hostname } : {}),
        };

        const result = await $api.get<TopCategories>('/dashboards/top-categories', {
          params,
          ...getTokenHeaders(token)
        });


        if (result) {
          this.topCategories = result;
          return result;
        } else {
          throw new Error("Не удалось получить топ категорий");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при получении топа категорий");
      }
    }
  },
});
