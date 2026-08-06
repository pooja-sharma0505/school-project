export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devServer: {
    port: 5000,
    host: '0.0.0.0'
  },

  devtools: {
    enabled: false
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Image optimization — converts images to WebP, lazy-loads by default,
  // and generates responsive srcsets.
  // ─────────────────────────────────────────────────────────────────────────────
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp'],
    densities: [1, 2],
    modifier: {
      format: 'webp',
      quality: 80
    }
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
        },
        {
          name: 'theme-color',
          content: '#ffffff'
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
        },
        {
          rel: 'preload',
          as: 'image',
          href: '/favicon.ico'
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Route Rules — SSR for auth-protected pages and server caching
  // only on API routes that are safe to cache.
  // ─────────────────────────────────────────────────────────────────────────────
  routeRules: {
    // Login page — no auth, static prerender
    '/login': { prerender: true, static: true },

    // Protected pages — SSR only. Do not use SWR/ISR here because auth
    // redirects and user-specific HTML must be evaluated per request.
    '/': { ssr: true },
    '/students': { ssr: true },
    '/classes': { ssr: true },
    '/subjects': { ssr: true },
    '/attendance': { ssr: true },
    '/exams': { ssr: true },
    '/fees': { ssr: true },
    '/results': { ssr: true },

    // API routes — server cache with different TTLs
    '/api/health': { static: true, swr: 10 },
    '/api/dashboard': { cache: { swr: true, maxAge: 60 } },
    '/api/students': { cache: { swr: true, maxAge: 60 } },
    '/api/classes': { cache: { swr: true, maxAge: 120 } },
    '/api/subjects': { cache: { swr: true, maxAge: 120 } },
    '/api/exams': { cache: { swr: true, maxAge: 120 } },
    '/api/attendance': { cache: { swr: true, maxAge: 60 } },
    '/api/fees': { cache: { swr: true, maxAge: 60 } },
    '/api/results': { cache: { swr: true, maxAge: 60 } },
    // /api/auth/me is NOT cached — it reads the JWT cookie and must
    // return fresh data for each user (caching would leak user data).
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Runtime config — same as before, kept intact
  // ─────────────────────────────────────────────────────────────────────────────
  runtimeConfig: {
    dbHost: process.env.DB_HOST || '',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || '',

    // JWT secret for signing/verifying auth tokens stored in httpOnly cookies.
    // MUST be set in Vercel Project Settings → Environment Variables.
    jwtSecret: process.env.JWT_SECRET || '',

    adminEmail: process.env.ADMIN_EMAIL || 'admin@scholar.edu',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',


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
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Experimental features — payload extraction reduces client JS,
  // view transitions for SPA-like navigation.
  // ─────────────────────────────────────────────────────────────────────────────
  experimental: {
    payloadExtraction: true,
    viewTransition: true,
    appManifest: false,
    asyncContext: true
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Vite optimisation — manualChunks, tree shaking, minification
  // ─────────────────────────────────────────────────────────────────────────────
  vite: {
    build: {
      // Split vendor bundles for parallel loading
      rollupOptions: {
        output: {
          manualChunks: {
            'vue': ['vue', 'vue-router'],
            'vendor': ['mysql2', 'bcryptjs']
          }
        }
      },
      // Minify with esbuild (faster than terser)
      minify: 'esbuild',
      // Target modern browsers for smaller bundles
      target: 'es2022',
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Reduce chunk size warning threshold
      chunkSizeWarningLimit: 1000
    },
    // Optimise dependencies
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      // Exclude server-only deps from client bundle
      exclude: ['mysql2', 'bcryptjs']
    },
    ssr: {
      noExternal: []
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Nitro — server engine optimisation for Vercel
  // ─────────────────────────────────────────────────────────────────────────────
  nitro: {
    preset: 'vercel',
    compressPublicAssets: true,
    storage: {
      cache: {
        driver: 'memory'
      }
    },
    // Vercel-specific: reduce cold starts
    serveStatic: true
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Build optimisation
  // ─────────────────────────────────────────────────────────────────────────────
  build: {
    transpile: []
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // TypeScript
  // ─────────────────────────────────────────────────────────────────────────────
  typescript: {
    strict: true,
    shim: false
  }
})
