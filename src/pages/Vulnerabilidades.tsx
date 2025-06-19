import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { vulnerabilidadesService } from '../services/api'
import { Vulnerabilidade } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Vulnerabilidades() {
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVuln, setEditingVuln] = useState<Vulnerabilidade | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  })

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    severidade: 'Baixa',
    resolvida: false
  })

  useEffect(() => {
    loadVulnerabilidades()
  }, [])

  const loadVulnerabilidades = async () => {
    try {
      const response = await vulnerabilidadesService.getAll()
      setVulnerabilidades(response.data)
    } catch (error) {
      toast.error('Erro ao carregar vulnerabilidades')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingVuln) {
        await vulnerabilidadesService.update(editingVuln.id, {
          ...editingVuln,
          ...formData
        })
        toast.success('Vulnerabilidade atualizada com sucesso!')
      } else {
        await vulnerabilidadesService.create(formData)
        toast.success('Vulnerabilidade criada com sucesso!')
      }
      
      loadVulnerabilidades()
      closeModal()
    } catch (error) {
      toast.error('Erro ao salvar vulnerabilidade')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await vulnerabilidadesService.delete(id)
      toast.success('Vulnerabilidade excluída com sucesso!')
      loadVulnerabilidades()
    } catch (error) {
      toast.error('Erro ao excluir vulnerabilidade')
    }
  }

  const openModal = (vuln?: Vulnerabilidade) => {
    if (vuln) {
      setEditingVuln(vuln)
      setFormData({
        titulo: vuln.titulo || '',
        descricao: vuln.descricao || '',
        severidade: vuln.severidade || 'Baixa',
        resolvida: vuln.resolvida
      })
    } else {
      setEditingVuln(null)
      setFormData({
        titulo: '',
        descricao: '',
        severidade: 'Baixa',
        resolvida: false
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingVuln(null)
  }

  const filteredVulnerabilidades = vulnerabilidades.filter(vuln =>
    vuln.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuln.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-white">Vulnerabilidades</h1>
          <p className="text-gray-400 mt-1">Gerencie as vulnerabilidades do sistema</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Vulnerabilidade</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar vulnerabilidades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Vulnerabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVulnerabilidades.map((vuln, index) => (
          <motion.div
            key={vuln.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-5 w-5 ${
                  vuln.severidade === 'Crítica' ? 'text-red-500' :
                  vuln.severidade === 'Alta' ? 'text-orange-500' :
                  vuln.severidade === 'Média' ? 'text-yellow-500' :
                  'text-green-500'
                }`} />
                <span className={`severity-badge severity-${vuln.severidade?.toLowerCase()}`}>
                  {vuln.severidade}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openModal(vuln)}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: vuln.id })}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{vuln.titulo}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{vuln.descricao}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {vuln.resolvida ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${vuln.resolvida ? 'text-green-400' : 'text-red-400'}`}>
                  {vuln.resolvida ? 'Resolvida' : 'Pendente'}
                </span>
              </div>
              <span className="text-xs text-gray-500">ID: {vuln.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVulnerabilidades.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Nenhuma vulnerabilidade encontrada</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVuln ? 'Editar Vulnerabilidade' : 'Nova Vulnerabilidade'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Título *</label>
            <input
              type="text"
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="form-input"
              placeholder="Digite o título da vulnerabilidade"
            />
          </div>

          <div>
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="form-input h-24 resize-none"
              placeholder="Descreva a vulnerabilidade..."
            />
          </div>

          <div>
            <label className="form-label">Severidade</label>
            <select
              value={formData.severidade}
              onChange={(e) => setFormData({ ...formData, severidade: e.target.value })}
              className="form-input"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="resolvida"
              checked={formData.resolvida}
              onChange={(e) => setFormData({ ...formData, resolvida: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-800 border-gray-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="resolvida" className="text-sm text-gray-300">
              Vulnerabilidade resolvida
            </label>
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
              {editingVuln ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Excluir Vulnerabilidade"
        message="Tem certeza que deseja excluir esta vulnerabilidade? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />
    </div>
  )
}