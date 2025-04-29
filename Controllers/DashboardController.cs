using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;
using VulnerabilityManager.Models;

[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context; // Injeção correta do contexto
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDTO>> GetDashboard()
    {
        var dashboard = new DashboardDTO
        {
            Vulnerabilidades = await _context.Vulnerabilidades
                .OrderBy(v => v.Id)
                .Include(v => v.Contramedidas) // Carrega contramedidas relacionadas
                .Select(v => new VulnerabilidadeDTO
                {
                    Id = v.Id,
                    Titulo = v.Titulo,
                    Severidade = v.Severidade,
                    Resolvida = v.Resolvida,
                    Contramedidas = v.Contramedidas
                        .OrderBy(c => c.Id)
                        .Select(c => new ContramedidaResumoDTO
                        {
                            Id = c.Id,
                            AcaoTomada = c.AcaoTomada
                        }).ToList()
                }).ToListAsync(),

            Ativos = await _context.Ativos
                .OrderBy(a => a.Id)
                .Select(a => new AtivoDTO
                {
                    Id = a.Id,
                    Nome = a.Nome,
                    Tipo = a.Tipo,
                    Localizacao = a.Localizacao
                }).ToListAsync(),

            Relatorios = await _context.Relatorios
                .OrderByDescending(r => r.DataGeracao)
                .Select(r => new RelatorioDTO
                {
                    Id = r.Id,
                    Titulo = r.Titulo,
                    DataGeracao = r.DataGeracao
                }).ToListAsync()
        };

        return Ok(dashboard);
    }
}