using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;
using VulnerabilityManager.Models;

[Route("api/[controller]")]
[ApiController]
public class ContramedidasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ContramedidasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Contramedida>>> GetContramedidas()
    {
        return await _context.Contramedidas
            .Include(c => c.Vulnerabilidade)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Contramedida>> GetContramedida(int id)
    {
        var contramedida = await _context.Contramedidas
            .Include(c => c.Vulnerabilidade)
            .FirstOrDefaultAsync(c => c.Id == id);

        return contramedida == null ? NotFound() : contramedida;
    }

    [HttpPost]
    public async Task<ActionResult<Contramedida>> PostContramedida(Contramedida contramedida)
    {
        // Validação manual do ID da vulnerabilidade
        if (!await _context.Vulnerabilidades.AnyAsync(v => v.Id == contramedida.VulnerabilidadeId))
        {
            return BadRequest("ID da Vulnerabilidade inválido");
        }

        _context.Contramedidas.Add(contramedida);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetContramedida", new { id = contramedida.Id }, contramedida);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutContramedida(int id, Contramedida contramedida)
    {
        if (id != contramedida.Id) return BadRequest();

        // Validação da vulnerabilidade na atualização
        if (!await _context.Vulnerabilidades.AnyAsync(v => v.Id == contramedida.VulnerabilidadeId))
        {
            return BadRequest("ID da Vulnerabilidade inválido");
        }

        _context.Entry(contramedida).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ContramedidaExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContramedida(int id)
    {
        var contramedida = await _context.Contramedidas.FindAsync(id);
        if (contramedida == null) return NotFound();

        _context.Contramedidas.Remove(contramedida);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool ContramedidaExists(int id)
    {
        return _context.Contramedidas.Any(e => e.Id == id);
    }
}