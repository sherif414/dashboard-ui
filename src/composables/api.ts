import { createClient } from '@supabase/supabase-js'
import 'process'
import { getTableDataParams } from 'types'
import type { Database } from 'types/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function getPaginatedData(
  tableName: string,
  columns: string,
  { orderBy = 'id', itemsPerPage = 10, page = 1, ascending = true }: getTableDataParams
) {
  const from = (page - 1) * itemsPerPage
  const to = page * itemsPerPage

  const response = await supabase
    .from(tableName)
    .select(columns, { count: 'estimated' })
    .range(from, to - 1)
    .order(orderBy, { ascending })

  return response
}
