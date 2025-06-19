import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Server, 
  Shield, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { dashboardService } from '../services/api'
import { DashboardData } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.getDashboard()
      setData(response.data)
    } catch (error) {
      toast.error('Erro ao carregar dashboard')
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Erro ao carregar dados do dashboard</p>
      </div>
    )
  }

  const vulnerabilidadesResolvidasCount = data.vulnerabilidades.filter(v => v.resolvida).length
  const vulnerabilidadesCriticasCount = data.vulnerabilidades.filter(v => v.severidade === 'Crítica').length
  const vulnerabilidadesAltasCount = data.vulnerabilidades.filter(v => v.severidade === 'Alta').length

  const stats = [
    {
      name: 'Total de Vulnerabilidades',
      value: data.vulnerabilidades.length,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Ativos Monitorados',
      value: data.ativos.length,
      icon: Server,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Contramedidas Ativas',
      value: data.vulnerabilidades.reduce((acc, v) => acc + v.contramedidas.length, 0),
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Relatórios Gerados',
      value: data.relatorios.length,
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: '+3%',
      changeType: 'increase'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral do sistema de vulnerabilidades</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-400 text-sm ml-1">vs mês anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerabilidades Críticas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Vulnerabilidades por Severidade</h3>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Crítica</span>
              </div>
              <span className="text-white font-medium">{vulnerabilidadesCriticasCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300">Alta</span>
              </div>
              <span className="text-white font-medium">{vulnerabilidadesAltasCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">Média</span>
              </div>
              <span className="text-white font-medium">
                {data.vulnerabilidades.filter(v => v.severidade === 'Média').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Baixa</span>
              </div>
              <span className="text-white font-medium">
                {data.vulnerabilidades.filter(v => v.severidade === 'Baixa').length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status das Vulnerabilidades */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Status das Vulnerabilidades</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Resolvidas</span>
              </div>
              <span className="text-white font-medium">{vulnerabilidadesResolvidasCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">Pendentes</span>
              </div>
              <span className="text-white font-medium">
                {data.vulnerabilidades.length - vulnerabilidadesResolvidasCount}
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Taxa de Resolução</span>
                <span className="text-green-500 font-medium">
                  {data.vulnerabilidades.length > 0 
                    ? Math.round((vulnerabilidadesResolvidasCount / data.vulnerabilidades.length) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${data.vulnerabilidades.length > 0 
                      ? (vulnerabilidadesResolvidasCount / data.vulnerabilidades.length) * 100
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Atividade Recente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Vulnerabilidades Recentes</h3>
        
        <div className="space-y-4">
          {data.vulnerabilidades.slice(0, 5).map((vuln, index) => (
            <div key={vuln.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  vuln.resolvida ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="text-white font-medium">{vuln.titulo}</p>
                  <p className="text-gray-400 text-sm">
                    {vuln.contramedidas.length} contramedida(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`severity-badge severity-${vuln.severidade?.toLowerCase()}`}>
                  {vuln.severidade}
                </span>
                {vuln.resolvida && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}