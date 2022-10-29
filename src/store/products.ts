import { defineStore } from 'pinia'
import { supabase } from '~/api'

export const useProductsStore = defineStore('products', () => {
  const productsList = ref()
  const productsCount = ref<number | null>(null)
  const publishedProducts = ref<number | null>(null)

  async function getProductTable() {
    const res = await supabase
      .from('products')
      .select('id, name, created_at, category, stock, sell_price, delivery_type, published', { count: 'exact' })
      .range(0, 7)
    return res
  }

  async function getProductsCount(): Promise<void> {
    if (productsCount.value) return
    const { data } = await supabase.rpc('products_published_count')
    publishedProducts.value = data as any
  }

  async function addProduct(product: any, image?: File): Promise<boolean> {
    // image is valid
    if (image && image.type.startsWith('image') && image.name) {
      const imgRes = await supabase.storage.from('products-images').upload('preview-images/' + image.name, image)

      // error on uploading image
      if (imgRes.error) {
        return false
      }

      // image uploaded successfully now upload the rest of the product
      product.image = imgRes.data.path
      const { error, status } = await supabase.from('products').insert([product])
      if (error) return false
      if (status == 201 || status == 200) return true
      return false
    }

    // image is invalid or upload without an image
    const { error, status } = await supabase.from('products').insert([product])
    if (error) return false
    if (status == 201 || status == 200) return true
    return false
    // if (additional_images) {
    //   additional_images.forEach(async (img) => {
    //     const res = await supabase.storage
    //       .from('public/products-images')
    //       .upload('additional-images' + img.name, img.file)
    //     console.log(res)
    //   })
    // }
  }

  return {
    productsList,
    productsCount,
    publishedProducts,
    getProductTable,
    getProductsCount,
    addProduct,
  }
})
