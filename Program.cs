using Microsoft.EntityFrameworkCore;
using VulnerabilityManager.Data;

var builder = WebApplication.CreateBuilder(args);

// Adicionar serviços ao container
builder.Services.AddControllers();

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configurar CORS (para desenvolvimento)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configurar pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Habilitar CORS apenas em desenvolvimento
    app.UseCors("AllowAll");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Executar migrações automaticamente (opcional para desenvolvimento)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();