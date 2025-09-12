// @ts-ignore
import IconHouse from '@/assets/img/house.svg?component';
// @ts-ignore
import ChartBar from '@/assets/img/chart-bar.svg?component'
// @ts-ignore
import Users from '@/assets/img/users.svg?component'
// @ts-ignore
import Notebook from '@/assets/img/notebook.svg?component'


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
        showFor: ["SA", "CA", "CO"],
      },
      {
        id: "grafana",
        label: "Статистика",
        href: grafanaUrl,
        iconComponent: ChartBar,
        external: true,
        showFor: ["SA", "CA", "CO"],
      },
      {
        id: "users",
        label: "Управление пользователями",
        to: "/users",
        iconComponent: Users,
        showFor: ["SA", "CA"],
      },
      {
        id: "context",
        label: "Управления контекстами",
        to: "/context",
        iconComponent: Notebook,
        showFor: ["SA", "CA"],
      },
    ]

    return fullMenu.filter((item) => item.showFor.includes(role))
  }

  return {
    getMenuForRole,
    grafanaUrl,
  }
}

