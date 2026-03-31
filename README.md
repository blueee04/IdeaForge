<div align="center">

# Le Sage

### Research-Backed Startup Idea Engine

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

*"Don't just generate ideas - validate them with research and connect with the minds that can make them real."*

</div>

---

## Overview

Le Sage is an AI-powered platform that combines deep research automation, novelty-based idea curation, and expert matchmaking. It helps aspiring entrepreneurs move from "What should I build?" to "Here's what you should build, why it works, and who can help."

### The Problem

Most startup ideas are built on intuition or generic AI outputs, leading to high failure rates and derivative products. Despite vast amounts of untapped innovation sitting in academic databases, founders lack the expertise to navigate technical papers, and researchers lack a path to commercialize their work.

### The Solution

Le Sage uses multi-agent open-source AI models to synthesize deep research into validated startup opportunities. Every idea is backed by evidence from academic papers, market data, and industry reports.

## Core Features

**Research-Backed Idea Generation**  
Startup ideas grounded in academic and industry research using Semantic Scholar, arXiv, and DuckDuckGo search.

**AI Automation Engine**  
Multi-agent system that researches market trends, analyzes competition, and evaluates feasibility using CrewAI orchestration.

**Novelty Control**  
Adjustable innovation threshold (1-10 scale) from incremental improvements to breakthrough ideas.

**Expert Matchmaking**  
Connect with field-specific experts backed by research credentials (in development).

## Architecture

### Tech Stack

**Frontend**
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Zustand for state management
- Supabase Auth (SSR with middleware)

**Backend**
- FastAPI (Python 3.11+)
- CrewAI for multi-agent orchestration
- HuggingFace Inference API (Mistral 7B) - free cloud LLM
- SlowAPI for rate limiting

**Data & Services**
- Supabase (PostgreSQL, Authentication, Realtime)
- ChromaDB for vector search
- Semantic Scholar API for academic research
- arXiv API for preprints
- DuckDuckGo Search for web research

**Infrastructure**
- Docker for containerization
- Langfuse for LLM observability
- Redis for distributed rate limiting

### Project Structure

```
Le-Sage/
├── frontend/              # Next.js 15 application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── services/     # API service layer
│   │   ├── stores/       # Zustand state management
│   │   ├── lib/          # Supabase client, utilities
│   │   └── types/        # TypeScript definitions
│   └── middleware.ts     # Auth protection
├── backend/              # FastAPI application
│   └── app/
│       ├── api/          # Route handlers
│       ├── agents/       # CrewAI agent definitions + tools
│       ├── services/     # External API integrations
│       ├── models/       # Pydantic schemas
│       └── core/         # Config, rate limiting
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- HuggingFace account (free) for cloud LLM inference
- Redis (optional, for distributed rate limiting)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Louis047/Le-Sage.git
cd Le-Sage
```

**2. Environment Configuration**

Create a `.env` file in the project root:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Semantic Scholar API (Required)
SEMANTIC_SCHOLAR_API_KEY=your_api_key

# HuggingFace (Required for AI - free tier available)
LLM_PROVIDER=huggingface
HF_TOKEN=your_huggingface_token

# Backend API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**3. Set up HuggingFace (Required for AI)**

HuggingFace provides free cloud-based LLM inference - no local GPU needed.

1. Create a free account at https://huggingface.co/join
2. Go to https://huggingface.co/settings/tokens
3. Click "New token" → Name it "le-sage" → Select "Read" permission → Create
4. Copy the token (starts with `hf_...`) and add to your `.env` as `HF_TOKEN`

The free tier includes:
- Unlimited requests to many models (rate limited)
- Access to Mistral 7B, Llama, Phi-3, and more
- No credit card required

**4. Start the backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API documentation available at `http://localhost:8000/docs`

**5. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

## Usage

### Generating Ideas

1. **Onboarding**: Select field of interest and set novelty threshold (1-10)
2. **Generation**: Multi-agent pipeline researches academic papers and market trends
3. **Review**: Each idea shows title, description, feasibility score, novelty rating, and research citations
4. **Save**: Store ideas to dashboard

### Multi-Agent Research Flow

```
User Request → Research Agent → Analysis Agent → Synthesis Agent
                     ↓                ↓                ↓
              Web Search    Semantic Scholar    Idea Generation
              DuckDuckGo      arXiv API          with Citations
```

## Rate Limiting

**Semantic Scholar API**: 1 request/second (enforced via throttling)  
**Idea Generation Endpoint**: 5 requests/hour per IP  
**Global API Limit**: 50 requests/hour, 200 requests/day per IP

Falls back to in-memory rate limiting if Redis is unavailable.

## Development

### Running Tests

```bash
# Frontend
cd frontend
npm run build

# Backend (tests to be added)
cd backend
pytest
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configured for Next.js
- All builds must pass before deployment

## Deployment

Not yet deployed. Project is currently in active development for FOSSHack 2026.

## Contributing

This project is being developed for FOSSHack 2026. For issues or questions, open an issue on GitHub.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with open-source tools:
- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [CrewAI](https://www.crewai.com/)
- [HuggingFace](https://huggingface.co/)
- [Supabase](https://supabase.com/)
- [Semantic Scholar](https://www.semanticscholar.org/)

## Demo

Demo video to be added.

---

<div align="center">

**[Report Bug](https://github.com/Louis047/Le-Sage/issues)**

Built by **Lone** and **Barshan** for **FOSSHack 2026**

</div>
