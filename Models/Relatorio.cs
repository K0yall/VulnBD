using System;

namespace VulnerabilityManager.Models
{
    public class Relatorio
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public DateTime DataGeracao { get; set; } // Campo adicionado
        public string Conteudo { get; set; }
    }
}