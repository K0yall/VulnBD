import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, FileText, Calendar, Download } from 'lucide-react'
import { relatoriosService } from '../services/api'
import { Relatorio } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRelatorio, setEditingRelatorio] = useState<Relatorio | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  })

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    dataGeracao: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadRelatorios()
  }, [])

  const loadRelatorios = async () => {
    try {
      const response = await relatoriosService.getAll()
      setRelatorios(response.data)
    } catch (error) {
      toast.error('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSend = {
        ...formData,
        dataGeracao: new Date(formData.dataGeracao).toISOString()
      }

      if (editingRelatorio) {
        await relatoriosService.update(editingRelatorio.id, {
          ...editingRelatorio,
          ...dataToSend
        })
        toast.success('Relatório atualizado com sucesso!')
      } else {
        await relatoriosService.create(dataToSend)
        toast.success('Relatório criado com sucesso!')
      }
      
      loadRelatorios()
      closeModal()
    } catch (error) {
      toast.error('Erro ao salvar relatório')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await relatoriosService.delete(id)
      toast.success('Relatório excluído com sucesso!')
      loadRelatorios()
    } catch (error) {
      toast.error('Erro ao excluir relatório')
    }
  }

  const openModal = (relatorio?: Relatorio) => {
    if (relatorio) {
      setEditingRelatorio(relatorio)
      setFormData({
        titulo: relatorio.titulo,
        conteudo: relatorio.conteudo,
        dataGeracao: new Date(relatorio.dataGeracao).toISOString().split('T')[0]
      })
    } else {
      setEditingRelatorio(null)
      setFormData({
        titulo: '',
        conteudo: '',
        dataGeracao: new Date().toISOString().split('T')[0]
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRelatorio(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredRelatorios = relatorios.filter(relatorio =>
    relatorio.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relatorio.conteudo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownload = (relatorio: Relatorio) => {
    const content = `
RELATÓRIO: ${relatorio.titulo}
Data de Geração: ${formatDate(relatorio.dataGeracao)}
ID: ${relatorio.id}

CONTEÚDO:
${relatorio.conteudo}

---
Gerado pelo Sistema VulnDB
    `.trim()

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-${relatorio.id}-${relatorio.titulo.replace(/[^a-zA-Z0-9]/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Relatório baixado com sucesso!')
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
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>
          <p className="text-gray-400 mt-1">Gerencie os relatórios de segurança</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Relatório</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar relatórios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRelatorios.map((relatorio, index) => (
          <motion.div
            key={relatorio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-400">Relatório</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleDownload(relatorio)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors duration-200"
                  title="Baixar relatório"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openModal(relatorio)}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: relatorio.id })}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
              {relatorio.titulo}
            </h3>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {relatorio.conteudo}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(relatorio.dataGeracao)}</span>
              </div>
              <span className="text-xs text-gray-500">ID: {relatorio.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRelatorios.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum relatório encontrado</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRelatorio ? 'Editar Relatório' : 'Novo Relatório'}
        size="xl"
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
              placeholder="Digite o título do relatório"
            />
          </div>

          <div>
            <label className="form-label">Data de Geração</label>
            <input
              type="date"
              value={formData.dataGeracao}
              onChange={(e) => setFormData({ ...formData, dataGeracao: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Conteúdo *</label>
            <textarea
              required
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              className="form-input h-48 resize-none"
              placeholder="Digite o conteúdo do relatório..."
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
              {editingRelatorio ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Excluir Relatório"
        message="Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />
    </div>
  )
}