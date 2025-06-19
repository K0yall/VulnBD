using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // Importante para o JsonIgnore
using VulnerabilityManager.Models;

public class Contramedida
{
    public int Id { get; set; }

    [Required(ErrorMessage = "A ação tomada é obrigatória")]
    public string AcaoTomada { get; set; } = string.Empty;

    [Required(ErrorMessage = "O ID da vulnerabilidade é obrigatório")]
    public int VulnerabilidadeId { get; set; }

    [JsonIgnore] // Evita serializar e causar ciclo infinito no JSON
    public Vulnerabilidade? Vulnerabilidade { get; set; }
}
