import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    throw error
  }
)

// Types
export interface Vault {
  id: number
  name: string
  description?: string
  ownerName: string
  ownerEmail: string
  itemCount?: number
  memberCount?: number
  expiringSoonCount?: number
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: number
  title: string
  vaultId: number
  category?: {
    id: number
    name: string
    description: string
    icon: string
  }
  brand?: string
  model?: string
  serialNumber?: string
  purchaseDate: string
  price?: number
  warrantyMonths?: number
  expiryDate?: string
  status: string
  notes?: string
  attachments: Array<{
    id: number
    fileUrl: string
    fileName: string
    fileSize: number
    fileType: string
    type: string
    uploadedAt: string
    uploadedByName: string
  }>
  isExpired: boolean
  isExpiringSoon: boolean
  daysUntilExpiry?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description: string
  icon: string
  reminderDaysDefault: number
}

export interface CreateVaultRequest {
  name: string
  description?: string
}

export interface CreateItemRequest {
  title: string
  vaultId: number
  categoryId?: number
  brand?: string
  model?: string
  serialNumber?: string
  purchaseDate: string
  price?: number
  warrantyMonths?: number
  notes?: string
}

// API functions
export const api = {
  // Vaults
  async getVaults(): Promise<Vault[]> {
    return apiClient.get('/vaults')
  },

  async getVault(id: number): Promise<Vault> {
    return apiClient.get(`/vaults/${id}`)
  },

  async createVault(data: CreateVaultRequest): Promise<Vault> {
    return apiClient.post('/vaults', data)
  },

  async updateVault(id: number, data: CreateVaultRequest): Promise<Vault> {
    return apiClient.put(`/vaults/${id}`, data)
  },

  async deleteVault(id: number): Promise<void> {
    return apiClient.delete(`/vaults/${id}`)
  },

  // Items
  async getItems(params: {
    vaultId: number
    categoryId?: number
    search?: string
    page?: number
    size?: number
    sort?: string
    direction?: string
  }): Promise<{
    content: Item[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }> {
    return apiClient.get('/items', { params })
  },

  async getItem(id: number): Promise<Item> {
    return apiClient.get(`/items/${id}`)
  },

  async createItem(data: CreateItemRequest): Promise<Item> {
    return apiClient.post('/items', data)
  },

  async updateItem(id: number, data: CreateItemRequest): Promise<Item> {
    return apiClient.put(`/items/${id}`, data)
  },

  async deleteItem(id: number): Promise<void> {
    return apiClient.delete(`/items/${id}`)
  },

  async getExpiringItems(days: number = 30): Promise<Item[]> {
    return apiClient.get(`/items/expiring?days=${days}`)
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return apiClient.get('/categories')
  },

  async getCategoriesWithItems(): Promise<Category[]> {
    return apiClient.get('/categories/with-items')
  },
} 