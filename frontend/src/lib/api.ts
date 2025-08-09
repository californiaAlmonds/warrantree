import axios from 'axios'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect to login if we're on the test page (testing expected failures)
      if (!window.location.pathname.includes('/test')) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('demoSession')
        window.location.href = '/login'
      }
    }
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

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  user: {
    id: number
    name: string
    email: string
    role: string
    emailVerified: boolean
    createdAt: string
  }
}

// API functions
export const api = {
  // Authentication
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/login', data)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/register', data)
  },

  async validateToken(): Promise<{ valid: boolean }> {
    return apiClient.get('/auth/validate')
  },

  async logout(): Promise<void> {
    return apiClient.post('/auth/logout')
  },

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
  async getItems(vaultId: number): Promise<Item[]> {
    return apiClient.get('/items', { params: { vaultId } })
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