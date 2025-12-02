import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { useUserStore } from "./user";
import { getTokenHeaders } from "~/helpers";
import type { Categories, CategoriesState } from "~/types/categories";
import type { ReportData, ReportDataByDevice, ReportsState } from "~/types/reports";


export const useReportsStore = defineStore("reports", {
  state: (): ReportsState => {
    return {
      report: null,
    };
  },

  getters: {
    // report: (state) => state.report,
  },

  actions: {
    async fetchReportAllDevices(from: string = 'now-24h', to: string = 'now'): Promise<ReportData> {
      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить отчёт. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить отчёт. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const params: Record<string, string | number> = {
          from,
          to
        };

        const reportData = await $api.get<ReportData>('/analytics/reports', {
          params,
          ...getTokenHeaders(token)
        });


        if (reportData) {
          this.report = reportData;
          return reportData;
        } else {
          throw new Error("Не удалось получить отчёт");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при получении отчёта");
      }
    },

    async fetchReportByDevice(from: string = 'now-24h', to: string = 'now', device: string) {
      const reportDataByDevice: ReportDataByDevice = {
        from: "2025-01-01",
        to: "2025-01-31",
        hostname: "KSU.domain-192775",

        device_analytics_page: {
          traffic: {
            count: 30000,
            data: {
              input: [
                15000, 20000, 25000, 18000, 12000, 14000, 22000,
                26000, 24000, 20000, 23000, 27000, 21000, 18000
              ],
              output: [
                10000, 13000, 16000, 14000, 12000, 11000, 15000,
                17000, 16000, 15500, 14000, 18000, 16500, 10000
              ],
              time: [
                "2025-08-01T00:00:00.000Z",
                "2025-08-03T00:00:00.000Z",
                "2025-08-06T00:00:00.000Z",
                "2025-08-09T00:00:00.000Z",
                "2025-08-12T00:00:00.000Z",
                "2025-08-15T00:00:00.000Z",
                "2025-08-18T00:00:00.000Z",
                "2025-08-21T00:00:00.000Z",
                "2025-08-24T00:00:00.000Z",
                "2025-08-27T00:00:00.000Z",
                "2025-08-30T00:00:00.000Z",
                "2025-09-01T00:00:00.000Z",
                "2025-09-03T00:00:00.000Z",
                "2025-09-06T00:00:00.000Z"
              ]
            }
          },

          requests_analytics: {
            allowed: {
              count: 100,
              data: [18000, 10000, 10000, 20000, 17000, 100],
              time: [
                "2025-01-22T00:00:00.000Z",
                "2025-01-23T00:00:00.000Z",
                "2025-01-24T00:00:00.000Z",
                "2025-01-25T00:00:00.000Z",
                "2025-01-26T00:00:00.000Z",
                "2025-01-27T00:00:00.000Z"
              ]

            },
            blocked: {
              count: 20,
              data: [18000, 10000, 10000, 20000, 15000, 17000],
              time: [
                "2025-01-22T00:00:00.000Z",
                "2025-01-23T00:00:00.000Z",
                "2025-01-24T00:00:00.000Z",
                "2025-01-25T00:00:00.000Z",
                "2025-01-26T00:00:00.000Z",
                "2025-01-27T00:00:00.000Z"
              ]
            },
            pending: {
              count: 25,
              data: [18000, 10000, 10000, 20000, 17000, 25000],
              time: [
                "2025-01-22T00:00:00.000Z",
                "2025-01-23T00:00:00.000Z",
                "2025-01-24T00:00:00.000Z",
                "2025-01-25T00:00:00.000Z",
                "2025-01-26T00:00:00.000Z",
                "2025-01-27T00:00:00.000Z"
              ]
            }
          },

          anomaly_block_stat: {
            all: 150,
            anomalies: 50,
            blocks: 10,
          }
        },

        anomalies_list_page: {
          device_anomaly: [
            {
              hostname: "ngfw-01",
              requests: 86000,
              anomaly_block_stat: {
                all: 50,
                anomalies: 5,
                blocks: 10,
                status: "Заблокировано",
                live_count: "10 дней",
                before_block: 32,
                pending: 91,
                after_block: 52
              },
              detections: {
                all: 140,
                allowed: 100,
                blocked: 20,
                unresolved: 20
              },
              traffic: {
                input: 110000,
                output: 50000
              }
            },
            {
              hostname: "ngfw-02",
              requests: 86000,
              anomaly_block_stat: {
                all: 50,
                anomalies: 5,
                blocks: 10,
                status: "Разрешено",
                live_count: "10 дней",
                before_block: 32,
                pending: 91,
                after_block: 52
              },
              detections: {
                all: 140,
                allowed: 100,
                blocked: 20,
                unresolved: 20
              },
              traffic: {
                input: 110000,
                output: 50000
              }
            },
            {
              hostname: "ngfw-03",
              requests: 86000,
              anomaly_block_stat: {
                all: 50,
                anomalies: 5,
                blocks: 10,
                status: "Разрешено",
                live_count: "10 дней",
                before_block: 32,
                pending: 91,
                after_block: 52
              },
              detections: {
                all: 140,
                allowed: 100,
                blocked: 20,
                unresolved: 20
              },
              traffic: {
                input: 110000,
                output: 50000
              }
            },
            {
              hostname: "ngfw-04",
              requests: 86000,
              anomaly_block_stat: {
                all: 50,
                anomalies: 5,
                blocks: 10,
                status: "Разрешено",
                live_count: "10 дней",
                before_block: 32,
                pending: 91,
                after_block: 52
              },
              detections: {
                all: 140,
                allowed: 100,
                blocked: 20,
                unresolved: 20
              },
              traffic: {
                input: 110000,
                output: 50000
              }
            },
          ]
        },

        categories_page: {
          categories: [
            {
              category: "Агрессия, расизм, терроризм",
              stat: { before_block: 62000, pending: 50000, after_block: 62000, all: 174000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Азартные игры",
              stat: { before_block: 77000, pending: 97000, after_block: 77000, all: 251000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Веб-почта",
              stat: { before_block: 76000, pending: 17000, after_block: 76000, all: 169000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Ботнеты",
              stat: { before_block: 49000, pending: 61000, after_block: 49000, all: 159000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Депрессивный контент",
              stat: { before_block: 26000, pending: 91000, after_block: 26000, all: 143000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Вредоносное ПО",
              stat: { before_block: 82000, pending: 53000, after_block: 82000, all: 217000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Игровые платформы",
              stat: { before_block: 91000, pending: 17000, after_block: 91000, all: 199000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Компьютерные игры",
              stat: { before_block: 51000, pending: 90000, after_block: 51000, all: 192000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Реестр запрещенных сайтов",
              stat: { before_block: 84000, pending: 30000, after_block: 84000, all: 198000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Досуг и развлечения",
              stat: { before_block: 49000, pending: 61000, after_block: 49000, all: 159000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Наркотики",
              stat: { before_block: 26000, pending: 91000, after_block: 26000, all: 143000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Фишинг",
              stat: { before_block: 82000, pending: 53000, after_block: 82000, all: 217000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Социальные сети",
              stat: { before_block: 91000, pending: 17000, after_block: 91000, all: 199000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Торренты и P2P-сети",
              stat: { before_block: 51000, pending: 90000, after_block: 51000, all: 192000 },
              traffic: { input: 110000, output: 50000 }
            },
            {
              category: "Реклама",
              stat: { before_block: 84000, pending: 30000, after_block: 84000, all: 198000 },
              traffic: { input: 110000, output: 50000 }
            }
          ]
        }
      };

      return reportDataByDevice;


      const userStore = useUserStore();
      try {
        await userStore.ensureValidToken();
      } catch {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить отчёт. Пользователь неавторизован",
        );
      }

      const token = useCookie('auth_token').value;

      if (!token) {
        userStore.clearToken();
        throw new Error(
          "Не удалось получить отчёт. Пользователь неавторизован",
        );
      }

      try {
        const { $api } = useNuxtApp();

        const params: Record<string, string | number> = {
          from,
          to
        };

        const reportData = await $api.get<ReportDataByDevice>(`/analytics/reports/${device}`, {
          params,
          // ...getTokenHeaders(token)
        });


        if (reportData) {
          this.report = reportData;
          return reportData;
        } else {
          throw new Error("Не удалось получить отчёт");
        }
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при получении отчёта");
      }
    }
  },
});
