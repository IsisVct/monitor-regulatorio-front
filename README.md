# 📊 Monitor Regulatório

> Sistema de monitoramento automático de publicações regulatórias do mercado financeiro e contábil brasileiro — BACEN, CVM, CPC, CFC e IASB/ISSB.

![Stack](https://img.shields.io/badge/Backend-.NET%209-512BD4?style=flat-square&logo=dotnet)
![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Banco-PostgreSQL-336791?style=flat-square&logo=postgresql)
![Stack](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-000000?style=flat-square&logo=vercel)
![Stack](https://img.shields.io/badge/Status-Live-10B981?style=flat-square)

🔗 **[monitor-regulatorio-front.vercel.app](https://monitor-regulatorio-front.vercel.app/)**

<img width="1920" height="1079" alt="image" src="https://github.com/user-attachments/assets/5af51e40-b124-47cc-a5bc-7ad88a618843" />

---

## 🎯 Sobre o Projeto

O Monitor Regulatório nasceu de uma necessidade real: acompanhar diariamente publicações de múltiplos órgãos reguladores é trabalhoso e sujeito a falhas humanas. Este sistema automatiza esse processo inteiramente.

Um Worker em background acessa os sites dos órgãos reguladores, extrai os dados relevantes e os armazena no banco. O front-end consome essa base e apresenta tudo em uma interface moderna, filtrável e exportável.

**Órgãos monitorados:**
- 🏦 **BACEN** — Normas e Audiências Públicas
- 📈 **CVM** — Resoluções, Deliberações, Audiências Públicas e Ofícios Circulares
- 📚 **CPC** — Audiências Públicas
- 🎓 **CFC** — Pronunciamentos e Resoluções
- 🌍 **IASB/ISSB** — Exposure Drafts, Normas e Notícias internacionais

---

## 🖥️ Interface

| Modo Claro | Modo Escuro |
|---|---|
| Cards brancos com sombras sutis | Terminal financeiro dark com acentos coloridos |

**Funcionalidades:**
- 🔍 Busca em tempo real por título e descrição
- 🗂️ Filtros por fonte, categoria e ordenação
- 🔴 Badge **NOVO** automático para publicações das últimas 24h
- 📋 Modal de detalhes ao clicar no card
- 📊 Barra de estatísticas por fonte e categoria
- ⬇️ Exportação para Excel com filtros aplicados
- 🌙 Alternância entre tema claro e escuro
- 📄 Paginação com 12 itens por página
- 📱 Layout responsivo — desktop e mobile

---

## 🏗️ Arquitetura

```
monitor-regulatorio/
├── MonitorRegulatorio.API/              # ASP.NET Core Web API
│   └── Controllers/
│       └── NormativoController.cs       # GET /api/normativos
│
├── MonitorRegulatorio.Application/      # Entidades e DTOs
│   └── Entities/
│       └── Normativo.cs
│
├── MonitorRegulatorio.Infrastructure/   # EF Core + PostgreSQL
│   ├── Data/
│   │   └── AppDbContext.cs
│   └── Migrations/
│
├── MonitorRegulatorio.Worker/           # Background Service
│   └── Services/
│       ├── MonitorWorker.cs             # PeriodicTimer — executa 1x/dia
│       ├── BacenAudienciasFetcher.cs
│       ├── BacenNormasFetcher.cs
│       ├── CvmAudienciasFetcher.cs
│       ├── CvmResolucoesFetcher.cs
│       ├── CvmLegislacaoFetcher.cs
│       ├── CPCFetcher.cs
│       ├── CFCFetcher.cs
│       ├── IasbAudienciasFetcher.cs
│       ├── IasbNoticiasFetcher.cs
│       └── IasbStandardsFetcher.cs
│
└── monitor-regulatorio-front/           # React + Vite
    └── src/
        └── pages/
            └── Home.jsx
```

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, Vite |
| Deploy Frontend | Vercel |
| Backend | ASP.NET Core 9, Web API |
| Worker | .NET 9 BackgroundService + PeriodicTimer |
| Deploy Backend | Render |
| ORM | Entity Framework Core 9 + Npgsql |
| Banco de dados | PostgreSQL (Railway) |
| Scraping | HtmlAgilityPack, HttpClient, Selenium WebDriver |
| Exportação | SheetJS (xlsx) |

---

## ☁️ Deploy

| Serviço | Plataforma | URL |
|---|---|---|
| Frontend (React) | Vercel | [monitor-regulatorio-front.vercel.app](https://monitor-regulatorio-front.vercel.app/) |
| Backend (API) | Render | [monitor-regulatorio-api.onrender.com](https://monitor-regulatorio-api.onrender.com) |
| Worker | Render | — |
| Banco de dados | Railway (PostgreSQL) | — |

> O código do backend e do worker é mantido em repositório privado.

---

## ⚙️ Desafios Técnicos

Cada site dos órgãos tem uma estrutura diferente — parte dos desafios resolvidos:

- **BACEN** — scraping de tabelas HTML com XPath e extração de IDs via regex para montar links dinâmicos
- **CFC** — formulário ASP.NET WebForms com 4 tokens de segurança (`__VIEWSTATE`, `__EVENTVALIDATION`, etc.)
- **CPC** — conteúdo carregado via AJAX; solução com gerenciamento de cookies de sessão e headers `X-Requested-With`
- **CVM** — múltiplas categorias capturadas em uma única requisição via parâmetros de URL
- **IASB** — parsing de datas em inglês (`20 April 2026`) com `CultureInfo.InvariantCulture`
- **Migração SQL Server → PostgreSQL** — adaptação de types (`DateTime` → UTC, `nvarchar` → `text`) e troca de provider EF Core

---

## 🚀 Como Rodar o Frontend Localmente

```bash
cd monitor-regulatorio-front
npm install

# Crie o .env apontando para a API em produção
echo "VITE_API_URL=https://monitor-regulatorio-api.onrender.com/api" > .env

npm run dev
```

Acesse `http://localhost:5173`

---

## 📁 Modelo de Dados

```csharp
public class Normativo
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Descricao { get; set; }
    public string Link { get; set; }
    public string Fonte { get; set; }       // BACEN | CVM | CPC | CFC | IASB/ISSB
    public string Categoria { get; set; }   // Audiência Pública | Normativo | Notícia | ...
    public DateTime Data { get; set; }
}
```

---

## 👩‍💻 Autora

**Isis** — [@IsisVct](https://github.com/IsisVct)

Estudante de TI apaixonada por resolver problemas reais com código. Este projeto combina conhecimento do mercado regulatório com desenvolvimento full-stack em .NET e React.

---

