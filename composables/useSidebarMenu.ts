// @ts-ignore
import IconHouse from '@/assets/img/house.svg?component';
// @ts-ignore
import ChartBar from '@/assets/img/chart-bar.svg?component'
// @ts-ignore
import Users from '@/assets/img/users.svg?component'
// @ts-ignore


export function useSidebarMenu() {
  const config = useRuntimeConfig();
  const grafanaUrl = `${config.public.grafana.host}:${config.public.grafana.port}`

  const getMenuForRole = (role: string) => {
    const fullMenu = [
      {
        id: "main",
        label: "Главная",
        to: "/dashboard",
        iconComponent: IconHouse,
        showFor: ["KSU", "KSF"],
      },
      {
        id: "users",
        label: "Управление пользователями",
        to: "/users",
        iconComponent: Users,
        showFor: ["KSU", "KSF"],
      },
      {
        id: "llm-review",
        label: "AI анализ",
        to: "/llm-review",
        iconComponent: ChartBar,
        showFor: ["KSU", "KSF"],
      },
      {
        id: "reports",
        label: "Отчеты",
        to: "/reports",
        iconComponent: ChartBar,
        showFor: ["KSU", "KSF"],
      },
      {
        id: "grafana",
        label: "Статистика",
        href: grafanaUrl,
        iconComponent: ChartBar,
        external: true,
        showFor: ["KSU", "KSF"],
      },
    ]

    return fullMenu.filter((item) => item.showFor.includes(role))
  }

  return {
    getMenuForRole,
    grafanaUrl,
  }
}

