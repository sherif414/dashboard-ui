import { defineStore } from 'pinia'
import { definitions } from 'types/supabase'
import { supabase } from '~/api'

export const useProductsStore = defineStore('products', () => {
  const productsList = ref<definitions['products'][] | null>(null)
  const productsCount = ref<number | null>(null)
  const publishedProducts = ref<number | null>(null)

  async function getProductList() {
    if (!productsList.value) {
      const { data, count } = await supabase.from('products').select('*', { count: 'exact' }).range(0, 7)
      productsList.value = data
      productsCount.value = count
    }
  }

  async function getProductsCount(): Promise<void> {
    if (productsCount.value) return
    const { data } = await supabase.rpc('products_published_count')
    publishedProducts.value = data as any
  }

  async function addProduct(product: definitions['products'], image?: File): Promise<boolean> {
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
    getProductList,
    getProductsCount,
    addProduct,
  }
})
