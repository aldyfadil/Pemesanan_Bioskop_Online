import { createClient } from '@supabase/supabase-js'

// 1. Ambil URL dari bagian "Data API" atau "Project Settings"
const supabaseUrl = 'https://znhgfvrktshtjurzxwqw.supabase.co'

// 2. Tempelkan Publishable Key yang kamu temukan tadi
const supabaseAnonKey = 'sb_publishable_mnC6eZ3Q3tog_WpwPiFjsw_1yUoGASo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)