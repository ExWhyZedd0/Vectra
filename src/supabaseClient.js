import { createClient } from '@supabase/supabase-js'

// GANTI DENGAN URL DAN KEY DARI DASHBOARD SUPABASE ANDA
const supabaseUrl = 'https://awzmfrzgtzvhjsqngykm.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3em1mcnpndHp2aGpzcW5neWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTg0MzAsImV4cCI6MjA4MDQ5NDQzMH0.lbedV0kNgCy_WBIb-jWzr6oYVXIiH_tdGH-PhWu-e7Q'

export const supabase = createClient(supabaseUrl, supabaseKey)