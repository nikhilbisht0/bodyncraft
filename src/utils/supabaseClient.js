import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnwqzfbfreugrmtqqynw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud3F6ZmJmcmV1Z3JtdHFxeW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTg2ODMsImV4cCI6MjA5MDUzNDY4M30.xE46yjsomBFUMsfhwHwYnh8VoxfKLsmTGIUXJXdRhkk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
