import { defineStore } from 'pinia'
import { supabase } from '~/api'
import type { ProductTable, getTableDataParams } from 'types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<ProductTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const countPublished = ref<number | null>(null)

  async function getProducts({ orderOptions, itemsPerPage, page }: getTableDataParams) {
    const from = (page - 1) * itemsPerPage
    const to = page * itemsPerPage - 1
    const { ascending, column, foreignTable } = orderOptions

    const { data, count, error } = await supabase
      .from('products')
      .select('id, name, created_at, category, stock, sell_price, delivery_type, published', { count: 'estimated' })
      .order(column, { ascending, foreignTable, nullsFirst: false })
      .range(from, to)

    if (error) useMessage('error', error.message || 'an error has occurred')
    products.value = data
    countAll.value = count
  }

  async function getCount() {
    const { count } = await supabase
      .from('products')
      .select(undefined, { count: 'estimated', head: true })
      .filter('published', 'eq', true)
    countPublished.value = count
  }

  async function insertImage(image: File, fileName: string) {
    return await supabase.storage.from('products-images').upload('preview-images/' + fileName, image)
  }

  async function insertProduct(product: any) {
    const { error } = await supabase.from('products').insert([product])
    return error
  }

  return {
    products,
    countAll,
    countPublished,
    getProducts,
    getCount,
    insertProduct,
    insertImage,
  }
})
