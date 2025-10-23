import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { defaultResponse } from "~/types/api";

import { useUserStore } from "./user";
import { getTokenHeaders } from "~/helpers";
import type { DetectionControlState, DetectionTable } from "~/types/detectionsControl";


export const useDetectionsControlStore = defineStore("userControl", {
  state: (): DetectionControlState => {
    return {
      detections: null,
    };
  },

  getters: {
    // detections: (state) => state.detections,
  },

  actions: {
    async fetchDetections(page: number = 1, limit: number = 11): Promise<DetectionTable> {
      const mockdata: DetectionTable = {
        data: [
            {
              id: 1,
              name: 'CorgiSecret-1x.dog',
              category: 'Экстремизм',
              date: '24.09.2025, 09:54',
              description: 'Агрессия, расизм, терроризм',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-2',
              requestCount: 26,
              status: 'blocking',
              isBlocked: false
            },
            {
              id: 2,
              name: 'CorgiSecret-1x.dog',
              category: 'Наркотики',
              date: '24.09.2025, 09:54',
              description: 'Зеркало заблокированного ресурса',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-2',
              requestCount: 10,
              status: 'verification',
              isBlocked: false
            },
            {
              id: 3,
              name: 'CorgiSecret-1x.dog',
              category: 'Экстремизм',
              date: '24.09.2025, 09:54',
              description: 'Прокси и анонимайзеры',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-1',
              requestCount: 12,
              status: 'blocking',
              isBlocked: false
            },
            {
              id: 4,
              name: 'CorgiSecret-1x.dog',
              category: 'Экстремизм',
              date: '24.09.2025, 09:54',
              description: 'Реестр запрещенных сайтов',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-1',
              requestCount: 26,
              status: 'blocking',
              isBlocked: false
            },
            {
              id: 5,
              name: 'CorgiSecret-1x.dog',
              category: 'Наркотики',
              date: '24.09.2025, 09:54',
              description: 'Азартные игры',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-1',
              requestCount: 10,
              status: 'verification',
              isBlocked: false
            },
            {
              id: 6,
              name: 'CorgiSecret-1x.dog',
              category: 'Наркотики',
              date: '24.09.2025, 09:54',
              description: 'Интернет-магазины',
              country: 'Россия',
              location: 'Раменский',
              ipAddress: '89.151.191.14',
              ngfw: 'ngfw-2',
              requestCount: 10,
              status: 'verification',
              isBlocked: true
            }
        ],
          meta: {
          limit: 6,
          page: 1,
          pages: 4,
          total: 37,
        },
      }

      return mockdata;

      // const userStore = useUserStore();
      // try {
      //   await userStore.ensureValidToken();
      // } catch {
      //   userStore.clearToken();
      //   throw new Error(
      //     "Не удалось получить список выявлений. Пользователь неавторизован",
      //   );
      // }

      // const token = useCookie('auth_token').value;

      // if (!token) {
      //   userStore.clearToken();
      //   throw new Error(
      //     "Не удалось получить список выявлений. Пользователь неавторизован",
      //   );
      // }

      // try {
      //   const { $api } = useNuxtApp();

      //   const params: Record<string, string | number> = {
      //     page,
      //     limit,
      //   };

      //   const detections = await $api.get<DetectionTable>('/detections', {
      //     params,
      //     ...getTokenHeaders(token)
      //   });


      //   if (detections) {
      //     this.detections = detections.data;
      //     return detections;
      //   } else {
      //     throw new Error("Не удалось получить список выявлений");
      //   }
      // } catch (error: any) {
      //   throw new Error(error.message || "Ошибка при получении списка выявлений");
      // }
    }
  },
});
