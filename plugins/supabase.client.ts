import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.public.supabaseAnonKey

  if (!url || !key) {
    console.error('[Scholar MS] Missing Supabase config. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY in .env')
  }

  const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
  return {
    provide: {
      supabase
    }
  }
})
