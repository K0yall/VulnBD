import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Shield, AlertTriangle } from 'lucide-react'
import { contramedidasService, vulnerabilidadesService } from '../services/api'
import { Contramedida, Vulnerabilidade } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Contramedidas() {
  const [contramedidas, setContramedidas] = useState<Contramedida[]>([])
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContramedida, setEditingContramedida] = useState<Contramedida | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  })

  const [formData, setFormData] = useState({
    acaoTomada: '',
    vulnerabilidadeId: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [contramedidasRes, vulnerabilidadesRes] = await Promise.all([
        contramedidasService.getAll(),
        vulnerabilidadesService.getAll()
      ])
      setContramedidas(contramedidasRes.data)
      setVulnerabilidades(vulnerabilidadesRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vulnerabilidadeId) {
      toast.error('Selecione uma vulnerabilidade')
      return
    }
    
    try {
      if (editingContramedida) {
        await contramedidasService.update(editingContramedida.id, {
          ...editingContramedida,
          ...formData
        })
        toast.success('Contramedida atualizada com sucesso!')
      } else {
        await contramedidasService.create(formData)
        toast.success('Contramedida criada com sucesso!')
      }
      
      loadData()
      closeModal()
    } catch (error) {
      toast.error('Erro ao salvar contramedida')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await contramedidasService.delete(id)
      toast.success('Contramedida excluída com sucesso!')
      loadData()
    } catch (error) {
      toast.error('Erro ao excluir contramedida')
    }
  }

  const openModal = (contramedida?: Contramedida) => {
    if (contramedida) {
      setEditingContramedida(contramedida)
      setFormData({
        acaoTomada: contramedida.acaoTomada,
        vulnerabilidadeId: contramedida.vulnerabilidadeId
      })
    } else {
      setEditingContramedida(null)
      setFormData({
        acaoTomada: '',
        vulnerabilidadeId: 0
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingContramedida(null)
  }

  const filteredContramedidas = contramedidas.filter(contramedida =>
    contramedida.acaoTomada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contramedida.vulnerabilidade?.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getVulnerabilidadeById = (id: number) => {
    return vulnerabilidades.find(v => v.id === id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contramedidas</h1>
          <p className="text-gray-400 mt-1">Gerencie as ações tomadas para mitigar vulnerabilidades</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Contramedida</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar contramedidas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Contramedidas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContramedidas.map((contramedida, index) => {
          const vulnerabilidade = contramedida.vulnerabilidade || getVulnerabilidadeById(contramedida.vulnerabilidadeId)
          
          return (
            <motion.div
              key={contramedida.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-400">Contramedida</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openModal(contramedida)}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, id: contramedida.id })}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                {contramedida.acaoTomada}
              </h3>

              {vulnerabilidade && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-300">Vulnerabilidade</span>
                  </div>
                  <p className="text-sm text-white font-medium">{vulnerabilidade.titulo}</p>
                  {vulnerabilidade.severidade && (
                    <span className={`inline-block mt-2 severity-badge severity-${vulnerabilidade.severidade.toLowerCase()}`}>
                      {vulnerabilidade.severidade}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>ID: {contramedida.id}</span>
                <span>Vuln ID: {contramedida.vulnerabilidadeId}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredContramedidas.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Nenhuma contramedida encontrada</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContramedida ? 'Editar Contramedida' : 'Nova Contramedida'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Vulnerabilidade *</label>
            <select
              required
              value={formData.vulnerabilidadeId}
              onChange={(e) => setFormData({ ...formData, vulnerabilidadeId: parseInt(e.target.value) })}
              className="form-input"
            >
              <option value={0}>Selecione uma vulnerabilidade</option>
              {vulnerabilidades.map(vuln => (
                <option key={vuln.id} value={vuln.id}>
                  {vuln.titulo} ({vuln.severidade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Ação Tomada *</label>
            <textarea
              required
              value={formData.acaoTomada}
              onChange={(e) => setFormData({ ...formData, acaoTomada: e.target.value })}
              className="form-input h-32 resize-none"
              placeholder="Descreva a ação tomada para mitigar a vulnerabilidade..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingContramedida ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Excluir Contramedida"
        message="Tem certeza que deseja excluir esta contramedida? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />
    </div>
  )
}