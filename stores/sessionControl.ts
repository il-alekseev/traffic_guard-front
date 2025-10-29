import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import type { defaultResponse } from "~/types/api";
import type { SessionTable, SessionControlState, SessionOrderType, SessionTypes, SessionStatus } from '~/types/sessionControl';
import { useUserStore } from "./user";
import { getTokenHeaders } from "~/helpers";
import type { Categories } from "~/types/categories";
import type { TraficStatuses } from "~/types/traficStatuses";
import type { OrderDir } from "~/types/otherTypes";


export const useSessionsControlStore = defineStore("sessionsControl", {
  state: (): SessionControlState => {
    return {
      sessions: null,
    };
  },

  getters: {
    // sessions: (state) => state.sessions,
  },

  actions: {
    async fetchSessions(from: string = 'now-10m', to: string = 'now', page: number = 1, limit: number = 11, order_by: SessionOrderType = 'id', order_dir: OrderDir = 'asc', search?: string, status?: SessionStatus, category?: Categories, type?: SessionTypes, hostname?: string,): Promise<SessionTable> {
      // const mockdata: SessionTable = {
      //   data: [
      //     {
      //       id: '1',
      //       status: 'allowed',
      //       url: 'Lindsay_Walton-12.org',
      //       ip: '192.168.1.10',
      //       ngfw: 'ngfw-1',
      //       full_name: 'Кузнецов Андрей Викторович',
      //       type: 'Фаервол',
      //       category: 'Насилие',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '2',
      //       status: 'allowed',
      //       url: 'Courtney_Henry.ru',
      //       ip: '10.0.0.45',
      //       ngfw: 'ngfw-1',
      //       full_name: 'Орлов Артём Сергеевич',
      //       type: 'VPN',
      //       category: 'Ботнеты',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '3',
      //       status: 'waiting',
      //       url: 'Tom_Cook.su',
      //       ip: '172.16.5.23',
      //       ngfw: 'ngfw-1',
      //       full_name: 'Смирнов Иван Алексеевич',
      //       type: 'Аномалия',
      //       category: 'Наркотики',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '4',
      //       status: 'ban',
      //       url: 'Whitney_Francis.design',
      //       ip: '192.168.2.34',
      //       ngfw: 'ngfw-2',
      //       full_name: 'Попов Сергей Евгеньевич',
      //       type: 'Блокировка',
      //       category: 'Фишинг',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '5',
      //       status: 'allowed',
      //       url: 'Leonard_Krasner.com',
      //       ip: '83.149.21.88',
      //       ngfw: 'ngfw-2',
      //       full_name: undefined,
      //       type: 'Аномалия',
      //       category: 'Торрент',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '6',
      //       status: 'ban',
      //       url: 'Floyd_Miles',
      //       ip: '192.168.10.55',
      //       ngfw: 'ngfw-2',
      //       full_name: 'Соколов Дмитрий Олегович',
      //       type: 'Блокировка',
      //       category: 'Вредоносное ПО',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '7',
      //       status: 'ban',
      //       url: 'Emily Selman',
      //       ip: '172.16.0.77',
      //       ngfw: 'ngfw-1',
      //       full_name: 'Михайлов Николай Андреевич',
      //       type: 'Аномалия',
      //       category: 'Алкоголь',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '8',
      //       status: 'waiting',
      //       url: 'Lindsay_Walton-12.org',
      //       ip: '10.0.1.12',
      //       ngfw: 'ngfw-1',
      //       full_name: 'Орлов Артём Сергеевич',
      //       type: 'VPN',
      //       category: 'Суицид',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '9',
      //       status: 'allowed',
      //       url: 'Lindsay_Walton-12.org',
      //       ip: '91.210.45.122',
      //       ngfw: 'ngfw-1',
      //       full_name: undefined,
      //       type: 'Аномалия',
      //       category: 'Азартные игры',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '10',
      //       status: 'allowed',
      //       url: 'Lindsay_Walton-12.org',
      //       ip: '192.168.5.44',
      //       ngfw: 'ngfw-2',
      //       full_name: 'Васильев Павел Николаевич',
      //       type: 'VPN',
      //       category: 'Наркотики',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //     {
      //       id: '11',
      //       status: 'ban',
      //       url: 'Lindsay_Walton-12.org',
      //       ip: '172.31.0.15',
      //       ngfw: 'ngfw-2',
      //       full_name: 'Павлов Денис Сергеевич',
      //       type: 'Фаервол',
      //       category: 'Проституция',
      //       datetime: '21.03.2025, 16:21',
      //     },
      //   ],
      //     meta: {
      //     limit: 11,
      //     page: 1,
      //     pages: 4,
      //     total: 37,
      //   },
      // }

      // return mockdata;

      // const userStore = useUserStore();
      // try {
      //   await userStore.ensureValidToken();
      // } catch {
      //   userStore.clearToken();
      //   throw new Error(
      //     "Не удалось получить список cессий. Пользователь неавторизован",
      //   );
      // }

      // const token = useCookie('auth_token').value;

      // if (!token) {
      //   userStore.clearToken();
      //   throw new Error(
      //     "Не удалось получить список cессий. Пользователь неавторизован",
      //   );
      // }

      try {
        const { $api } = useNuxtApp();

        const params: Record<string, string | number> = {
          from,
          to,
          page,
          limit,
          order_by,
          order_dir,
          ...(search ? { search } : {}),
          ...(hostname ? { hostname } : {}),
          ...(category ? { category } : {}),
          ...(type ? { type } : {}),
          ...(status ? { status } : {}),
        };

        const sessions = await $api.get<SessionTable>('/sessions', {
          params,
          // ...getTokenHeaders(token)
        });


        if (sessions) {
          this.sessions = sessions.data;
          return sessions;
        } else {
          throw new Error("Не удалось получить список cессий");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при получении списка cессий");
      }
    }
  },
});
