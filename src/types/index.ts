export interface Vulnerabilidade {
  id: number
  titulo: string
  descricao?: string
  severidade?: string
  resolvida: boolean
  contramedidas?: Contramedida[]
}

export interface Ativo {
  id: number
  nome?: string
  tipo?: string
  localizacao?: string
}

export interface Contramedida {
  id: number
  acaoTomada: string
  vulnerabilidadeId: number
  vulnerabilidade?: Vulnerabilidade
}

export interface Relatorio {
  id: number
  titulo: string
  dataGeracao: string
  conteudo: string
}

export interface DashboardData {
  vulnerabilidades: VulnerabilidadeDTO[]
  ativos: AtivoDTO[]
  relatorios: RelatorioDTO[]
}

export interface VulnerabilidadeDTO {
  id: number
  titulo: string
  severidade: string
  resolvida: boolean
  contramedidas: ContramedidaResumoDTO[]
}

export interface ContramedidaResumoDTO {
  id: number
  acaoTomada: string
}

export interface AtivoDTO {
  id: number
  nome: string
  tipo: string
  localizacao: string
}

export interface RelatorioDTO {
  id: number
  titulo: string
  dataGeracao: string
}