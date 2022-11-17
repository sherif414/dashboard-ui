import { defineStore } from 'pinia'
import { supabase } from '~/api'
import type { ProductTable, getTableDataParams } from 'types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<ProductTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const countPublished = ref<number | null>(null)

  async function getProducts({ orderBy, itemsPerPage, page, ascending }: getTableDataParams) {
    const from = (page - 1) * itemsPerPage
    const to = page * itemsPerPage

    const { data, count } = await supabase
      .from('products')
      .select('id, name, created_at, category, stock, sell_price, delivery_type, published', { count: 'estimated' })
      .range(from, to - 1)
      .order(orderBy, { ascending })

    products.value = data
    countAll.value = count
  }

  async function getCount(): Promise<void> {
    const { count } = await supabase
      .from('products')
      .select(undefined, { count: 'estimated', head: true })
      .filter('published', 'eq', true)
    countPublished.value = count
  }

  async function addProduct(product: any, image?: File): Promise<boolean> {
    // image is valid
    if (image && image.type.startsWith('image') && image.name) {
      const imgRes = await supabase.storage.from('products-images').upload('preview-images/' + image.name, image)

      // error on uploading image
      if (imgRes.error) {
        return false
      }

      // image uploaded successfully now upload the rest of the product data
      product.image = imgRes.data.path
      const { error, status } = await supabase.from('products').insert(product)
      if (error) return false
      if (status == 201 || status == 200) return true
      return false
    }

    // image is invalid or upload without an image
    const { error, status } = await supabase.from('products').insert([product])
    if (error) return false
    if (status == 201 || status == 200) return true
    return false
  }

  return {
    products,
    countAll,
    countPublished,
    getProducts,
    getCount,
    addProduct,
  }
})
