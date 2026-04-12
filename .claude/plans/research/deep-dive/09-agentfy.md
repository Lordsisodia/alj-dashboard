# Deep-Dive: Agentfy-io/Agentfy

**Repository:** https://github.com/Agentfy-io/Agentfy
**Stars:** ~391
**Language:** Python 3.11+
**License:** MIT
**Maintainers:** @callmeiks, @Evil0ctal
**Sponsored by:** TikHub (social media data APIs)

---

## 1. What It Does

Agentfy is a modular, multi-agent coordination system for automating tasks across social media platforms. It uses LLMs to translate natural language user intents into structured, executable task chains that sub-agents collaborate on in real-time.

The tagline: **"ASK ONCE, LET THE AGENT DO THE REST!"**

Core use cases:
- Find and contact potential buyers via DM (buyer targeting & outreach)
- Broadcast events/content to multiple platforms simultaneously (cross-platform promotions)
- Repurpose videos into platform-optimized posts (content transformation)
- Auto-reply to DMs in the customer's language (automated messaging)
- Discover influencers for campaign partnerships (creator/influencer discovery)
- Monitor competitors across platforms

---

## 2. Architecture

Agentfy is structured as an **open agent protocol prototype**, drawing inspiration from:
- **Google's A2A** (Agents-to-Agents protocol)
- **Anthropic's MCP** (Model Context Protocol)

### 2.1 Core Pipeline Modules

The system runs a four-stage pipeline per request:

```
Perception → Memory → Reasoning → Action
```

| Module | Responsibility |
|--------|---------------|
| **PerceptionModule** | Validates and sanitizes raw user input |
| **MemoryModule** | Stores/retrieves chat history, workflow state, agent knowledge |
| **ReasoningModule** | Parses intent, selects agents, builds the workflow chain |
| **ActionModule** | Executes the workflow, tracks active workflows, returns results |

### 2.2 Registry-Based Agent Loading

Agents are registered in `agents_registry.json`. New agents can be added by:
1. Creating a directory under `agents/`
2. Implementing three function types: `crawler`, `analysis`, `interactive`
3. Registering in `agents_registry.json`
4. The orchestrator dynamically loads and invokes them based on intent

### 2.3 Data Flow Per Platform

Each platform agent follows a **Crawl → Analyze → Interact** chain:

```
fetch_user_tweets() [crawler] → clean_raw_data() [analysis] → post_tweets()/reply_to_tweets() [interactive]
```

- **Crawlers** return `List[Dict]` of raw platform data
- **Analysis functions** (`clean_raw_data`) filter and extract only relevant fields based on user intent, accepting a natural language description of desired fields
- **Interactive functions** perform write actions (post, reply, DM, follow)

---

## 3. Supported Platforms

| Platform | Crawlers | Analysis | Interactive |
|----------|----------|----------|-------------|
| **X (Twitter)** | Yes | Yes | Yes (post, delete, like, follow, DM) |
| **TikTok** | Yes | Yes | Not yet in registry |
| **Instagram** | Yes | Yes | Not yet in registry |
| **YouTube** | Yes | Yes | No |
| **WhatsApp** | Yes | Yes | No |
| **Quora** | Yes | Yes | No |
| **Xiaohongshu** | Via TikHub | Via TikHub | Via TikHub |
| **Lemon8** | Via TikHub | Via TikHub | Via TikHub |
| **Bilibili** | Via TikHub | Via TikHub | Via TikHub |

**Data access** for TikTok, Douyin, Instagram, YouTube, X, Xiaohongshu, Lemon8, Bilibili comes via **TikHub APIs** (sponsor-provided).

---

## 4. Workflow Patterns

### 4.1 Intent-to-Workflow Pipeline

When a user submits a natural language request:

1. **Perception**: Input is validated and wrapped in a `UserInput` model with metadata (user_id, session_id, source)
2. **Memory**: Chat history is fetched for context
3. **Reasoning**: The `ReasoningModule.analyze_request_and_build_workflow()` method:
   - Parses the intent using the LLM
   - Selects agents from the registry
   - Chains steps into a workflow with parameters
   - Identifies any missing parameters
4. **If missing parameters**: The workflow is stored and a `PARAMETERS_REQUIRED` response is returned
5. **If ready**: The workflow is dispatched to `ActionModule.execute_workflow()` as a background task

### 4.2 Cross-Platform Posting Pattern

The reasoning module builds a workflow that can target multiple platforms in parallel:

```python
# ReasoningModule builds workflow like:
{
    "workflow_id": "uuid",
    "steps": [
        {"agent": "tiktok_crawler", "function": "fetch_video", "params": {...}},
        {"agent": "twitter_analysis", "function": "clean_raw_data", "params": {...}},
        {"agent": "twitter_interactive", "function": "post_tweet", "params": {...}},
        {"agent": "instagram_interactive", "function": "post_photo", "params": {...}}
    ],
    "missing_parameters": [...]
}
```

### 4.3 Scheduling

Agentfy does not appear to have a built-in cron/scheduler. Scheduling is likely handled externally (e.g., calling the API endpoint on a schedule). The FastAPI server exposes workflow triggers; persistent scheduling would be layered on top.

### 4.4 Multi-Account Management

Account credentials are stored in `.env` as platform-specific API keys. The registry allows per-platform agent instantiation. Multi-account switching would be handled by:
- Loading different credentials per workflow invocation
- Passing account identifiers as workflow parameters

---

## 5. Tech Stack

| Layer | Technology |
|-------|------------|
| **Language** | Python 3.11+ |
| **AI** | OpenAI API (LLM for intent parsing and agent reasoning) |
| **API** | FastAPI (REST, port 8000) |
| **Web UI** | Streamlit (port 8501) |
| **CLI** | Custom CLI via `run_agent_cli.py` |
| **Data Access** | TikHub APIs (sponsored) |
| **Serialization** | Pydantic (request/response models) |
| **Async** | FastAPI BackgroundTasks for workflow execution |

**Requirements (inferred):** `fastapi`, `uvicorn`, `streamlit`, `openai`, `pydantic`, `requests` / `httpx`, plus platform SDKs.

---

## 6. API Structure

The FastAPI server (`run_agent_api.py`) exposes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/process` | POST | Submit a natural language request; returns `workflow_id` + status |
| `/workflow/{workflow_id}/status` | GET | Poll for workflow completion or get stored results |
| `/workflow/parameters` | POST | Supply missing parameters and trigger execution |

### Example Request

```json
POST /process
{
  "text": "Post my latest YouTube video to Twitter and Instagram",
  "files": [],
  "user_id": "user123",
  "session_id": "sess_abc"
}
```

### Example Response

```json
// First call (missing params)
{
  "status": "PARAMETERS_REQUIRED",
  "workflow_id": "uuid",
  "missing_parameters": [{"name": "video_url", "description": "...", "required": true}]
}

// After supplying params
POST /workflow/parameters
{
  "workflow_id": "uuid",
  "parameters": {"video_url": "https://..."}
}
// Response:
{
  "status": "PROCESSING",
  "workflow_id": "uuid",
  "message": "Workflow is being executed with updated parameters"
}
```

---

## 7. Patterns to Extract for Our Content Scheduler

### 7.1 Registry-Based Agent Loading
Adopt a JSON or YAML registry that defines platform agents, their functions, parameters, and return types. This makes adding new platforms (LinkedIn, Pinterest, etc.) a config-only change, not a code change.

### 7.2 Intent → Workflow Chain Architecture
Separate the concerns:
- **Reasoning/Intent Parser**: Converts "post to IG and Twitter" → ordered step chain
- **Executor**: Runs each step, tracks state, handles retries
- **Memory**: Stores results per workflow_id for polling

This decouples the AI layer from the execution layer. We can reuse this for our `agency-dash` social scheduling UI.

### 7.3 Crawl → Analyze → Transform → Post Pattern
```
[Fetch raw content] → [Clean/transform for platform] → [Post with platform-specific metadata]
```

This three-phase pattern is ideal for our use case: pull content once, adapt per platform.

### 7.4 Parameter Gaps + Resume
The `missing_parameters` flow is excellent UX. Instead of failing on the first missing field, the system collects requirements across steps and prompts the user for each. We should replicate this in our scheduler UI.

### 7.5 Background Execution + Status Polling
`BackgroundTasks` + `workflow_id` polling is a clean pattern for long-running platform API calls. FastAPI handles the async dispatch; the client polls `/workflow/{id}/status`.

### 7.6 Multi-Platform Broadcast
The registry supports building workflows that fan out to multiple platform agents from a single user intent. This is the core pattern for "post everywhere" functionality.

---

## 8. Multi-Account Management

Agentfy's approach is credential-centric (API keys in `.env`). For our multi-account needs:

| Concern | Agentfy Pattern | Our Recommendation |
|---------|----------------|---------------------|
| Credentials | Per-platform keys in env | Encrypted per-account tokens in DB |
| Account selection | Workflow parameter | Dropdown in UI + stored in user profile |
| Platform sessions | Single per platform | One session per account per platform |
| Switching | Env var reload | Session context loaded per request |

**Suggested DB schema additions for multi-account:**
- `social_accounts(id, user_id, platform, access_token, refresh_token, account_name, account_id, created_at)`
- Workflow context carries `account_id` → lookup token → make API call

**Account discovery** could use platform APIs (Instagram Business, Twitter Developer) to list managed pages/profiles, surfaced in the UI for account selection.

---

## 9. Key File Locations (for reference)

| File | Purpose |
|------|---------|
| `agents_registry.json` | Registry of all agents, functions, parameters |
| `core/perception/module.py` | Input validation |
| `core/memory/module.py` | Chat history, workflow storage |
| `core/reasoning/module.py` | Intent parsing + workflow building |
| `core/action/module.py` | Workflow execution + active tracking |
| `run_agent_api.py` | FastAPI server with all endpoints |
| `run_agent_app.py` | Streamlit web UI |
| `run_agent_cli.py` | CLI interface |
| `config.py` | API key / env var mapping |
| `requirements.txt` | Python dependencies |

---

## 10. Summary

Agentfy is a well-architected proof-of-concept for LLM-driven social media automation. Its strongest contributions:

1. **Intent → Workflow chain** — cleanly separates AI reasoning from execution
2. **Registry pattern** — makes the system infinitely extensible without code changes
3. **Parameter gap handling** — graceful collection of missing inputs before execution
4. **Background execution + polling** — non-blocking API model
5. **Multi-platform fan-out** — single intent, multiple platform agents

For our `agency-dash` content scheduler, the most valuable extraction is the **reasoning module's workflow builder** combined with the **agent registry** pattern. We should implement a similar registry-backed, LLM-powered intent parser that outputs structured job queues, with FastAPI endpoints for triggering and polling.
