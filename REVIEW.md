# PQN Security Review Checklist

> This file is read by Claude Code `/security-review` and `/pqn-security-review`.
> Every PR must pass these checks before merge. No exceptions.

## MANDATORY: Pillar 6 Security Gates

### 1. Network Exposure
- Does this PR expose ANY service, endpoint, or port to the public internet?
- Does this PR use Tailscale Funnel, ngrok, Cloudflare Tunnel, or any tunneling?
- Does this PR add any publicly-addressable URL to infrastructure behind Tailscale?
- **If YES to any: BLOCK. Services behind Tailscale stay behind Tailscale.**

### 2. Data Flow
- Does user input or business data pass through ANY third-party service in plaintext?
- Does this PR relay sensitive data through a cloud intermediary before the processor?
- Are credentials stored in or transmitted through third-party services?
- **If YES to any: BLOCK. Data stays local or gets encrypted before transit.**

### 3. Credential Blast Radius
- If any single credential in this PR leaks, what can an attacker access?
- Does a leaked API key grant access to the knowledge graph or business data?
- Are credentials scoped to minimum necessary permissions?
- **If blast radius is "everything": BLOCK. Redesign with scoped credentials.**

### 4. PII Handling
- Does this PR handle names, addresses, SSNs, financial data, or health records?
- If yes, does it pass through Presidio PII filter before external transmission?
- Does PII ever leave the Tailscale perimeter unfiltered?
- **If PII leaves unfiltered: BLOCK.**

## Standard Security Checks

### 5. Secrets
- No API keys, tokens, passwords, or connection strings in code
- No secrets in environment variable defaults
- .env files in .gitignore

### 6. Auth and Input
- New endpoints have authentication
- Rate limiting on public-facing endpoints
- User input validated and sanitized

## PQN Architecture Rules (non-negotiable)
- Services behind Tailscale NEVER get public endpoints
- pqn-brain, Graphiti, FalkorDB, Ollama are TAILSCALE ONLY
- pqn-command (Vercel) is the ONLY public-facing service
- Data flows from public to private, never private to public
- The Data Arbiter decides what external LLMs see, not the caller
