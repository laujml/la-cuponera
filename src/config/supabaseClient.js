import { createClient } from '@supabase/supabase-js'

// Leer las credenciales del archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear el cliente de Supabase que se usá en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)