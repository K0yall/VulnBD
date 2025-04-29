using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;
using VulnerabilityManager.Models;

[Route("api/[controller]")]
[ApiController]
public class AtivosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AtivosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ativo>>> GetAtivos()
    {
        return await _context.Ativos.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Ativo>> GetAtivo(int id)
    {
        var ativo = await _context.Ativos.FindAsync(id);
        return ativo == null ? NotFound() : ativo;
    }

    [HttpPost]
    public async Task<ActionResult<Ativo>> PostAtivo(Ativo ativo)
    {
        _context.Ativos.Add(ativo);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetAtivo", new { id = ativo.Id }, ativo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAtivo(int id, Ativo ativo)
    {
        if (id != ativo.Id) return BadRequest();

        _context.Entry(ativo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AtivoExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAtivo(int id)
    {
        var ativo = await _context.Ativos.FindAsync(id);
        if (ativo == null) return NotFound();

        _context.Ativos.Remove(ativo);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool AtivoExists(int id)
    {
        return _context.Ativos.Any(e => e.Id == id);
    }
}