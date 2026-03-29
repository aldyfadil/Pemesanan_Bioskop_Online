import { createClient } from '@supabase/supabase-js'

// Pakai import.meta.env biar aman di Vercel!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)