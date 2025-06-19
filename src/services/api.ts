import axios from 'axios'
import { Vulnerabilidade, Ativo, Contramedida, Relatorio, DashboardData } from '../types'

const API_BASE_URL = 'http://localhost:5049/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Dashboard
export const dashboardService = {
  getDashboard: () => api.get<DashboardData>('/Dashboard'),
}

// Vulnerabilidades
export const vulnerabilidadesService = {
  getAll: () => api.get<Vulnerabilidade[]>('/Vulnerabilidades'),
  getById: (id: number) => api.get<Vulnerabilidade>(`/Vulnerabilidades/${id}`),
  create: (data: Omit<Vulnerabilidade, 'id'>) => api.post<Vulnerabilidade>('/Vulnerabilidades', data),
  update: (id: number, data: Vulnerabilidade) => api.put(`/Vulnerabilidades/${id}`, data),
  delete: (id: number) => api.delete(`/Vulnerabilidades/${id}`),
}

// Ativos
export const ativosService = {
  getAll: () => api.get<Ativo[]>('/Ativos'),
  getById: (id: number) => api.get<Ativo>(`/Ativos/${id}`),
  create: (data: Omit<Ativo, 'id'>) => api.post<Ativo>('/Ativos', data),
  update: (id: number, data: Ativo) => api.put(`/Ativos/${id}`, data),
  delete: (id: number) => api.delete(`/Ativos/${id}`),
}

// Contramedidas
export const contramedidasService = {
  getAll: () => api.get<Contramedida[]>('/Contramedidas'),
  getById: (id: number) => api.get<Contramedida>(`/Contramedidas/${id}`),
  create: (data: Omit<Contramedida, 'id'>) => api.post<Contramedida>('/Contramedidas', data),
  update: (id: number, data: Contramedida) => api.put(`/Contramedidas/${id}`, data),
  delete: (id: number) => api.delete(`/Contramedidas/${id}`),
}

// Relatórios
export const relatoriosService = {
  getAll: () => api.get<Relatorio[]>('/Relatorios'),
  getById: (id: number) => api.get<Relatorio>(`/Relatorios/${id}`),
  create: (data: Omit<Relatorio, 'id'>) => api.post<Relatorio>('/Relatorios', data),
  update: (id: number, data: Relatorio) => api.put(`/Relatorios/${id}`, data),
  delete: (id: number) => api.delete(`/Relatorios/${id}`),
}