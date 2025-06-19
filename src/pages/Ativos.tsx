import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Server, MapPin } from 'lucide-react'
import { ativosService } from '../services/api'
import { Ativo } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Ativos() {
  const [ativos, setAtivos] = useState<Ativo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAtivo, setEditingAtivo] = useState<Ativo | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  })

  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    localizacao: ''
  })

  useEffect(() => {
    loadAtivos()
  }, [])

  const loadAtivos = async () => {
    try {
      const response = await ativosService.getAll()
      setAtivos(response.data)
    } catch (error) {
      toast.error('Erro ao carregar ativos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAtivo) {
        await ativosService.update(editingAtivo.id, {
          ...editingAtivo,
          ...formData
        })
        toast.success('Ativo atualizado com sucesso!')
      } else {
        await ativosService.create(formData)
        toast.success('Ativo criado com sucesso!')
      }
      
      loadAtivos()
      closeModal()
    } catch (error) {
      toast.error('Erro ao salvar ativo')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await ativosService.delete(id)
      toast.success('Ativo excluído com sucesso!')
      loadAtivos()
    } catch (error) {
      toast.error('Erro ao excluir ativo')
    }
  }

  const openModal = (ativo?: Ativo) => {
    if (ativo) {
      setEditingAtivo(ativo)
      setFormData({
        nome: ativo.nome || '',
        tipo: ativo.tipo || '',
        localizacao: ativo.localizacao || ''
      })
    } else {
      setEditingAtivo(null)
      setFormData({
        nome: '',
        tipo: '',
        localizacao: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAtivo(null)
  }

  const filteredAtivos = ativos.filter(ativo =>
    ativo.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ativo.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ativo.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeIcon = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'servidor':
        return '🖥️'
      case 'workstation':
        return '💻'
      case 'mobile':
        return '📱'
      case 'rede':
        return '🌐'
      default:
        return '📦'
    }
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
          <h1 className="text-3xl font-bold text-white">Ativos</h1>
          <p className="text-gray-400 mt-1">Gerencie os ativos de TI da organização</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Ativo</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar ativos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAtivos.map((ativo, index) => (
          <motion.div
            key={ativo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTypeIcon(ativo.tipo || '')}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{ativo.nome}</h3>
                  <p className="text-sm text-gray-400">{ativo.tipo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openModal(ativo)}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: ativo.id })}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Server className="h-4 w-4" />
                <span>Tipo: {ativo.tipo || 'Não especificado'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Local: {ativo.localizacao || 'Não especificado'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <span className="text-xs text-gray-500">ID: {ativo.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAtivos.length === 0 && (
        <div className="text-center py-12">
          <Server className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum ativo encontrado</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAtivo ? 'Editar Ativo' : 'Novo Ativo'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="form-input"
              placeholder="Digite o nome do ativo"
            />
          </div>

          <div>
            <label className="form-label">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="form-input"
            >
              <option value="">Selecione o tipo</option>
              <option value="Servidor">Servidor</option>
              <option value="Workstation">Workstation</option>
              <option value="Mobile">Mobile</option>
              <option value="Rede">Rede</option>
              <option value="Aplicação">Aplicação</option>
              <option value="Banco de Dados">Banco de Dados</option>
            </select>
          </div>

          <div>
            <label className="form-label">Localização</label>
            <input
              type="text"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              className="form-input"
              placeholder="Digite a localização do ativo"
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
              {editingAtivo ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Excluir Ativo"
        message="Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />
    </div>
  )
}