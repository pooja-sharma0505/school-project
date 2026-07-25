export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devServer: {
    port: 3000
  },

  devtools: {
    enabled: false
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  app: {
    head: {
      title: 'Scholar MS — School Management System',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'description',
          content: 'Complete School & College Management System'
        }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap'
        }
      ]
    }
  },

  runtimeConfig: {
    // Database connection — required for all API routes.
    // Defaults are empty strings so the app builds even without .env,
    // but getPool() will throw a clear error at runtime if they're missing.
    dbHost: process.env.DB_HOST || '',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || '',

    // Optional API key for write operations (POST/PUT/DELETE).
    // If not set, auth is disabled (dev mode).
    apiKey: process.env.API_KEY || '',

    public: {
      supabaseUrl:
        process.env.NUXT_PUBLIC_SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        '',

      supabaseAnonKey:
        process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY ||
        ''
    }
  }
})
