import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { getTableDataParams, ProductTable } from 'types'
import { productService } from '~/services/productService'
import { useMessage } from '~/composables/message'

export const useProductsStore = defineStore('products', () => {
  const products = ref<ProductTable[] | null>(null)
  const countAll = ref<number | null>(null)
  const countPublished = ref<number | null>(null)

  async function getProducts(params: getTableDataParams) {
    try {
      const { data, count } = await productService.getProducts(params)
      products.value = data
      countAll.value = count
    } catch (e: any) {
      useMessage('error', e.message || 'an error has occurred')
    }
  }

  async function getCount() {
    countPublished.value = await productService.getPublishedCount()
    countAll.value = await productService.getAllCount()
  }

  async function insertImage(image: File, fileName: string) {
    return await productService.insertImage(image, fileName)
  }

  async function insertProduct(product: any) {
    const { error } = await productService.createProduct(product)
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
