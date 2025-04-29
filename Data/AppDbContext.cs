using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Models;
namespace VulnerabilityManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vulnerabilidade> Vulnerabilidades { get; set; }
        public DbSet<Ativo> Ativos { get; set; }
        public DbSet<Contramedida> Contramedidas { get; set; }
        public DbSet<Relatorio> Relatorios { get; set; }
    }
}
