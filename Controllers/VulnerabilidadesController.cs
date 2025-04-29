using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;
using VulnerabilityManager.Models;

[Route("api/[controller]")]
[ApiController]
public class VulnerabilidadesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VulnerabilidadesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vulnerabilidade>>> GetVulnerabilidades()
    {
        return await _context.Vulnerabilidades.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vulnerabilidade>> GetVulnerabilidade(int id)
    {
        var vulnerabilidade = await _context.Vulnerabilidades.FindAsync(id);
        return vulnerabilidade == null ? NotFound() : vulnerabilidade;
    }

    [HttpPost]
    public async Task<ActionResult<Vulnerabilidade>> PostVulnerabilidade(Vulnerabilidade vulnerabilidade)
    {
        _context.Vulnerabilidades.Add(vulnerabilidade);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetVulnerabilidade", new { id = vulnerabilidade.Id }, vulnerabilidade);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutVulnerabilidade(int id, Vulnerabilidade vulnerabilidade)
    {
        if (id != vulnerabilidade.Id) return BadRequest();

        _context.Entry(vulnerabilidade).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!VulnerabilidadeExists(id)) return NotFound();
            throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVulnerabilidade(int id)
    {
        var vulnerabilidade = await _context.Vulnerabilidades.FindAsync(id);
        if (vulnerabilidade == null) return NotFound();

        _context.Vulnerabilidades.Remove(vulnerabilidade);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool VulnerabilidadeExists(int id)
    {
        return _context.Vulnerabilidades.Any(e => e.Id == id);
    }
}