import { createClient } from '@supabase/supabase-js'
import 'process'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
// const channel = supabase.channel('test-channel', {
//   config: {
//     broadcast: { ack: true },
//   },
// })
