using System.ComponentModel.DataAnnotations;
using VulnerabilityManager.Models;

public class Contramedida
{
    public int Id { get; set; }

    [Required(ErrorMessage = "A ação tomada é obrigatória")]
    public string AcaoTomada { get; set; } = string.Empty;

    [Required(ErrorMessage = "O ID da vulnerabilidade é obrigatório")]
    public int VulnerabilidadeId { get; set; }

    // Propriedade de navegação (não obrigatória no input)
    public Vulnerabilidade? Vulnerabilidade { get; set; }
}