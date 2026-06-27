import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qxsokhkwrcaxfzzmevec.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4c29raGt3cmNheGZ6em1ldmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTI4MTEsImV4cCI6MjA5NDYyODgxMX0.pKCqXnrpML1RcfyIKDxZJfLkQnJXUNh02e8MwYfsdVs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})