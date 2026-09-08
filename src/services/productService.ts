import type { getTableDataParams, OrderItem, Product, ProductTable } from 'types'
import { mockDb } from './mock/mockDb'
import { simulateLatency } from './delay'

export const productService = {
  async getProducts({ orderOptions, itemsPerPage, page }: getTableDataParams): Promise<{ data: ProductTable[]; count: number }> {
    await simulateLatency(180, 300)
    let list = [...mockDb.products]

    // Sorting
    const { column, ascending } = orderOptions
    if (column) {
      list.sort((a: any, b: any) => {
        const valA = a[column]
        const valB = b[column]
        if (valA === valB) return 0
        if (valA === null || valA === undefined) return 1
        if (valB === null || valB === undefined) return -1
        if (typeof valA === 'string' && typeof valB === 'string') {
          return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
      })
    }

    const count = list.length
    const from = (page - 1) * itemsPerPage
    const paginated = list.slice(from, from + itemsPerPage).map((p) => ({
      id: p.id,
      name: p.name,
      created_at: p.created_at,
      category: p.category,
      stock: p.stock,
      sell_price: p.sell_price,
      delivery_type: p.delivery_type,
      published: p.published,
    }))

    return { data: paginated, count }
  },

  async getPublishedCount(): Promise<number> {
    return mockDb.products.filter((p) => p.published).length
  },

  async getAllCount(): Promise<number> {
    return mockDb.products.length
  },

  async getProductById(id: number): Promise<Product | null> {
    await simulateLatency(120, 220)
    return mockDb.getProduct(id)
  },

  async getProductOrderItems(productId: number): Promise<OrderItem[]> {
    await simulateLatency(150, 250)
    return mockDb.order_items.filter((item) => item.product_id === productId)
  },

  async togglePublishStatus(id: number): Promise<{ data: Product | null; error: null | { message: string } }> {
    await simulateLatency(300, 450)
    const product = mockDb.getProduct(id)
    if (!product) return { data: null, error: { message: 'Product not found' } }
    const updated = mockDb.updateProduct(id, { published: !product.published })
    return { data: updated, error: null }
  },

  async createProduct(product: Partial<Product>, imageFile?: File | null): Promise<{ data: Product | null; error: null | { message: string } }> {
    await simulateLatency(450, 650)
    try {
      let imagePath: string | null = null
      if (imageFile) {
        imagePath = await mockDb.fileToBase64(imageFile)
      } else if (product.image) {
        imagePath = product.image
      }

      const created = mockDb.insertProduct({
        name: product.name ?? 'Untitled Product',
        stock: product.stock ?? 0,
        published: product.published ?? true,
        category: product.category ?? 'Uncategorized',
        sell_price: product.sell_price ?? 0,
        cost_price: product.cost_price ?? 0,
        discount_type: product.discount_type ?? null,
        discount_value: product.discount_value ?? null,
        description: product.description ?? null,
        expiration_date: product.expiration_date ?? null,
        image: imagePath,
        additional_images: product.additional_images ?? [],
        delivery_type: product.delivery_type ?? ['delivery'],
      })
      return { data: created, error: null }
    } catch (e: any) {
      return { data: null, error: { message: e.message || 'Failed to create product' } }
    }
  },

  async insertImage(image: File, _fileName: string): Promise<{ data: { path: string }; error: null }> {
    await simulateLatency(350, 500)
    const path = await mockDb.fileToBase64(image)
    return { data: { path }, error: null }
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    await simulateLatency(150, 250)
    const term = searchTerm.toLowerCase().trim()
    if (!term) return []
    return mockDb.products
      .filter((p) => p.name?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term))
      .slice(0, 10)
  },
}
