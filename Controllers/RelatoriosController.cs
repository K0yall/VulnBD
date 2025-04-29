using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;
using VulnerabilityManager.Models;

[Route("api/[controller]")]
[ApiController]
public class RelatoriosController : ControllerBase
{
    private readonly AppDbContext _context;

    public RelatoriosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Relatorio>>> GetRelatorios()
    {
        return await _context.Relatorios.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Relatorio>> GetRelatorio(int id)
    {
        var relatorio = await _context.Relatorios.FindAsync(id);
        return relatorio == null ? NotFound() : relatorio;
    }

    [HttpPost]
    public async Task<ActionResult<Relatorio>> PostRelatorio(Relatorio relatorio)
    {
        _context.Relatorios.Add(relatorio);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetRelatorio", new { id = relatorio.Id }, relatorio);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutRelatorio(int id, Relatorio relatorio)
    {
        if (id != relatorio.Id) return BadRequest();

        _context.Entry(relatorio).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RelatorioExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRelatorio(int id)
    {
        var relatorio = await _context.Relatorios.FindAsync(id);
        if (relatorio == null) return NotFound();

        _context.Relatorios.Remove(relatorio);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool RelatorioExists(int id)
    {
        return _context.Relatorios.Any(e => e.Id == id);
    }
}