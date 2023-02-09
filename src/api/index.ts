import { createClient } from '@supabase/supabase-js'
import 'process'
import type { Database } from 'types/supabase'

export const supabase = createClient<Database>(
  'https://mcvcidxgqdmfkoctzgbl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdmNpZHhncWRtZmtvY3R6Z2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjMyNTI5ODksImV4cCI6MTk3ODgyODk4OX0.r811ro-xC9NdKuGCcBZ72MyXm8-mc9rUvfpjxlVDkVY'
)
