namespace VulnerabilityManager.Models;
using System.ComponentModel.DataAnnotations;

public class Ativo
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Tipo { get; set; }
    public string? Localizacao { get; set; }
}