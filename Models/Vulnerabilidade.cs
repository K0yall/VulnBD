namespace VulnerabilityManager.Models;
using System.ComponentModel.DataAnnotations;
public class Vulnerabilidade
{
    public int Id { get; set; }
    [Required]
    public string? Titulo { get; set; }
    public string? Descricao { get; set; }
    public string? Severidade { get; set; } // Baixa, Média, Alta, Crítica
    public bool Resolvida { get; set; } = false;
    public List<Contramedida> Contramedidas { get; set; } = new();
}