# MiroFish

<div align="center">

<img src="./static/image/MiroFish_logo_compressed.jpeg" alt="MiroFish Logo" width="75%"/>

**A Simple and Universal Swarm Intelligence Engine, Predicting Anything**

<a href="https://www.shanda.com/" target="_blank"><img src="./static/image/shanda_logo.png" alt="MiroFish | Shanda" height="40"/></a>

[![GitHub Stars](https://img.shields.io/github/stars/666ghj/MiroFish?style=flat-square&color=DAA520)](https://github.com/666ghj/MiroFish/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.com/channels/1469200078932545606/1469201282077163739)
[![X](https://img.shields.io/badge/X-Follow-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/mirofish_ai)

</div>

## ⚡ Overview

**MiroFish** is a next-generation AI prediction engine powered by multi-agent technology. By extracting seed information from the real world (such as breaking news, policy drafts, or financial signals), it automatically constructs a high-fidelity parallel digital world. Within this space, thousands of intelligent agents with independent personalities, long-term memory, and behavioral logic freely interact and undergo social evolution. You can inject variables dynamically from a "God's-eye view" to precisely deduce future trajectories — **rehearse the future in a digital sandbox, and win decisions after countless simulations**.

> **How it works:**
> 1. Upload seed materials (data analysis reports, news, or narratives).
> 2. Describe your prediction requirements in natural language.
> 3. MiroFish generates a detailed prediction report and a deeply interactive digital world.

## 🚀 Setup Instructions

### Prerequisites

| Tool | Version | Description | Check Installation |
|------|---------|-------------|-------------------|
| **Node.js** | 18+ | Frontend runtime, includes npm | `node -v` |
| **Python** | ≥3.11, ≤3.12 | Backend runtime | `python --version` |
| **uv** | Latest | Python package manager | `uv --version` |

### 1. Configure Environment Variables

1. Copy the example configuration file:
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file and fill in the required API keys.

**Required Environment Variables:**

```env
# LLM API Configuration (supports OpenAI SDK compatible APIs)
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus

# Zep Cloud Configuration
ZEP_API_KEY=your_zep_api_key
```

### 2. Install Dependencies

Install all dependencies (frontend and backend) at once:
```bash
npm run setup:all
```

### 3. Start Services

Start both frontend and backend development servers from the project root:
```bash
npm run dev
```

**Service URLs:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`

---

## 📄 Acknowledgments

**MiroFish has received strategic support and incubation from Shanda Group!**

MiroFish's simulation engine is powered by **[OASIS (Open Agent Social Interaction Simulations)](https://github.com/camel-ai/oasis)**. We sincerely thank the CAMEL-AI team for their open-source contributions.
