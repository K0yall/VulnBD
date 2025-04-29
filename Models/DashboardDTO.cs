namespace VulnerabilityManager.Models
{
    public class DashboardDTO
    {
        public List<VulnerabilidadeDTO> Vulnerabilidades { get; set; } = new();
        public List<AtivoDTO> Ativos { get; set; } = new();
        public List<RelatorioDTO> Relatorios { get; set; } = new();
    }

    public class VulnerabilidadeDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Severidade { get; set; } = string.Empty;
        public bool Resolvida { get; set; }
        public List<ContramedidaResumoDTO> Contramedidas { get; set; } = new();
    }

    public class ContramedidaResumoDTO
    {
        public int Id { get; set; }
        public string AcaoTomada { get; set; } = string.Empty;
    }

    public class AtivoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Localizacao { get; set; } = string.Empty;
    }

    public class RelatorioDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public DateTime DataGeracao { get; set; }
    }
}