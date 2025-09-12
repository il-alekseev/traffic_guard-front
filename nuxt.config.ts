// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiGateway: {
        host: '',
        port: ''
      },
      grafana: {
        host: '',
        port: ''
      },
      nodeEnv: ''
    },
  },

  vite: {
    plugins: [require('vite-svg-loader')()],
  },

  css: ["@/assets/css/global.css"],

  modules: ["@pinia/nuxt"],

  routeRules: {
    "/": { redirect: "/auth" },
  },

  app: {
    head: {
      charset: "utf-8",
      title: "Fazenda",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@450&display=swap'
        },
        { rel: "icon", type: "image/ico", href: "/icons/favicon.ico" },
      ],
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
