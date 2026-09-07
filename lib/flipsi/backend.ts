import type { Backend } from './store'
import { supabaseBackend } from './backend-supabase'

/* Written by flash-cards/scripts/deploy-flipsi.mjs: on sumska.io the store is Supabase, nothing else. */
export const pickBackend = (): Backend => supabaseBackend()
export const backendName = () => 'supabase'
