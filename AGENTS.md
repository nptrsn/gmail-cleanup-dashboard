# PQN Agent Guidelines

## Review guidelines

CRITICAL SECURITY GATES (block merge if violated):

1. NETWORK EXPOSURE: Any code that exposes services behind Tailscale to the public internet is a P0 blocker. This includes Tailscale Funnel, ngrok, Cloudflare Tunnel, or any tunneling service. The following services are TAILSCALE ONLY and must NEVER be publicly accessible: pqn-brain, Graphiti, FalkorDB, Ollama, Open WebUI.

2. DATA RELAY: Any code that sends user messages, chat content, or business data through a third-party cloud service (Supabase, AWS, any cloud database) in PLAINTEXT before reaching the intended processor is a P0 blocker. Encrypted relay is acceptable. Plaintext relay is not.

3. CREDENTIAL BLAST RADIUS: If a single leaked API key or token would grant access to the knowledge graph (Graphiti/FalkorDB), all business entities, or the entire infrastructure, that is a P0 blocker. Credentials must be scoped to minimum necessary permissions.

4. PII LEAKAGE: Any code that allows names, addresses, SSNs, financial data, health records, or customer information to leave the Tailscale network perimeter without PII filtering (Presidio) is a P0 blocker.

5. SECRETS IN CODE: Any hardcoded API keys, tokens, passwords, or connection strings in source code is P0.

Architecture rules:
- pqn-command (Vercel) is the ONLY public-facing service
- Data flows from public to private networks, never the reverse
- The Data Arbiter (pqn-brain on Tower) decides what external LLMs see
- All Claude API usage must be $0 (Claude Code CLI via Max subscription, not paid API)
- Docker ports for internal services must bind to 127.0.0.1, not 0.0.0.0

Standard code review:
- TypeScript must compile clean (tsc --noEmit)
- No console.log in production code
- No empty catch blocks
- Auth required on every public endpoint
- Rate limiting on all API routes
