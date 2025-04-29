# 🔒 VulnDB

API REST para gerenciamento de vulnerabilidades de segurança da informação com integração PostgreSQL.

[![.NET](https://img.shields.io/badge/.NET-8.0-purple)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-blue)](https://www.postgresql.org/)
[![Insomnia](https://img.shields.io/badge/Testes-Insomnia-5849BE)](https://insomnia.rest/)

---

## ⚙️ Tecnologias Utilizadas

- **Backend**: ASP.NET Core 8  
- **Banco de Dados**: PostgreSQL + Entity Framework Core 8  
- **Testes**: Insomnia  
- **Arquitetura**: REST + Clean Code

---

## 🎯 Objetivo

Sistema CRUD completo para gestão de vulnerabilidades de segurança, incluindo:

- Registro de ativos de TI  
- Acompanhamento de contramedidas  
- Geração de relatórios  
- Classificação por severidade (Baixa/Média/Alta/Crítica)

---

## 🚀 Instalação Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/K0yall/VulnBD.git
```

### 2. Configure o banco de dados no `appsettings.json`

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=5432;Database=vulnerability_db;User Id=postgres;Password=sua_senha;"
}
```

### 3. Execute as migrações

```bash
dotnet ef database update
```

### 4. Inicie a API

```bash
dotnet run
```

---

## 📡 Endpoints Principais

### Vulnerabilidades (`/api/Vulnerabilidades`)

| Método | Descrição         | Body Exemplo |
|--------|-------------------|--------------|
| GET    | Lista todas       | —            |
| POST   | Cria nova         | ✅ Abaixo     |
| PUT    | Atualiza por ID   | ✅ Abaixo     |
| DELETE | Remove por ID     | —            |

### Ativos (`/api/Ativos`)

| Método | Descrição         |
|--------|-------------------|
| GET    | Lista todos       |
| POST   | Cadastra novo     |

### Contramedidas (`/api/Contramedidas`)

| Método | Descrição                           |
|--------|-------------------------------------|
| POST   | Vincula ação a vulnerabilidade      |

---

## 📋 Exemplo de Requisição

### POST `/api/Vulnerabilidades`

```json
{
  "titulo": "Injeção SQL",
  "descricao": "Vulnerabilidade no formulário de login",
  "severidade": "Alta",
  "resolvida": false
}
```

**Resposta:**

```json
{
  "id": 1,
  "titulo": "Injeção SQL",
  "severidade": "Alta",
  "resolvida": false
}
```

---

## 🧪 Testando com Insomnia

1. Baixe a coleção de exemplos  
2. No Insomnia:  
   `Import/Export > Import Data > From File`  
3. Altere a URL base para:  
   `http://localhost:5000`

---

## 🗂️ Estrutura do Projeto

```
VulnDB/
├── Controllers/         # Controladores da API
│   ├── VulnerabilidadesController.cs
│   ├── AtivosController.cs
│   └── ...
├── Data/                # Configuração do EF Core
│   └── AppDbContext.cs
├── Models/              # Entidades do sistema
│   ├── Vulnerabilidade.cs
│   ├── Ativo.cs
│   └── ...
├── Migrations/          # Scripts de migração
└── appsettings.json     # Configurações gerais
```

---

## 📌 Próximas Etapas

- [ ] Autenticação JWT  
- [ ] Dashboard gráfico  
- [ ] Integração com base de dados CVE  
- [ ] Sistema de notificações  

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.
