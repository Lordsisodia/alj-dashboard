# Deep Dive: google-gemini/genai-processors

**Repository:** https://github.com/google-gemini/genai-processors
**Stars:** 2.1k | **Forks:** 213 | **Version:** 2.0.3 | **License:** Apache 2.0
**Last Updated:** April 11, 2026

---

## Overview

GenAI Processors is a lightweight Python library (Python 3.11+) for building modular, asynchronous AI pipelines. It provides a unified abstraction layer over Gemini APIs, addressing LLM API fragmentation through three core pillars:

1. **Unified Content Model** — Consistent content representation across models
2. **Processors** — Composable Python classes using native asyncio
3. **Streaming** — Built-in async streaming without extra plumbing

---

## Architecture

### Core Design Pattern

The library uses a **dual-interface pattern**:

| Interface | Purpose |
|-----------|---------|
| **PRODUCER** | For processor authors — defines content streaming behavior |
| **CONSUMER** | For callers — simple async access patterns |

### Module Structure

```
genai_processors/
├── content_api   # Content types and structures
├── processor     # Core processing logic
└── streams       # Streaming utilities
```

### Key Classes

| Class | Purpose |
|-------|---------|
| `Processor` | Main processor class |
| `PartProcessor` | Processes individual content parts |
| `ProcessorFn` | Processor as a function |
| `ProcessorPart` | Wrapper around `genai.types.Part` with metadata (MIME type, role, custom attributes) |
| `GenaiModel` | Turn-based API calls |
| `LiveProcessor` | Real-time streaming interactions |

### Content Types

- **Text** — String content with auto-casting to Parts
- **Images** — Via `ProcessorPart` with MIME type metadata
- **Audio** — Supported with metadata enrichment
- **Custom JSON** — Arbitrary structured content

**Note:** The library wraps `genai.types.Part` with additional metadata. Video content is not explicitly documented, but image processing capabilities (frame extraction, analysis) could apply to video workflows.

---

## Parallel Content Processing

### Processor Composition

The library supports two composition patterns:

```python
# Chaining — sequential processing
chained = processor1 + processor2 + processor3

# Parallelization — concurrent execution
parallel_result = processor1 // processor2 // processor3
```

### Async Streaming

Built entirely on Python's `asyncio` framework:

```python
# Three usage patterns
result = await processor(input_content).gather()
text = await processor(input_content).text()
async for part in processor(input_content):
    print(part.text, end="")
```

### Stream Utilities

- `stream_content` — Stream content processing
- `gather_stream` — Gather streamed results
- Split, concatenate, and merge async streams

---

## Video Analysis Capabilities

**Explicit video support is not documented.** However, the architecture supports:

1. **Image-based analysis** — Process individual video frames as images via `ProcessorPart`
2. **Temporal processing** — Chain processors for frame-by-frame analysis
3. **Streaming** — `LiveProcessor` enables real-time video commentary use cases

The Live API tutorial includes an example of a "live commentary agent with event detection" that could apply to video streams.

---

## API Patterns

### Turn-Based (GenaiModel)

```python
from genai_processors import GenaiModel

model = GenaiModel(model="gemini-2.0-flash")
result = await model(input_content).gather()
```

### Streaming (LiveProcessor)

```python
from genai_processors import LiveProcessor

live = LiveProcessor(model="gemini-2.0-flash-live")
async for part in live(input_content):
    process_stream(part)
```

### Custom Processors

```python
from genai_processors import part_processor_function

@part_processor_function
async def my_processor(part: ProcessorPart) -> ProcessorPart:
    # Custom processing logic
    return enriched_part
```

### Processor Creation

```python
from genai_processors import apply_sync, apply_async, chain, parallel

# Synchronous application
apply_sync(processor, content)

# Asynchronous application
apply_async(processor, content)

# Chain multiple processors
chained = chain(processor1, processor2, processor3)

# Parallel execution with concatenation
parallel_concat(processor1, processor2)
```

---

## Rate Limits

**Not documented in public-facing materials.**

Rate limits are inherited from the underlying Gemini API:
- Gemini API standard rate limits apply
- Streaming connections may have separate limits
- No library-specific throttling documented

---

## Cost

**Not documented in public-facing materials.**

The library is a free open-source tool (Apache 2.0). Usage costs are determined by:
- Underlying Gemini API calls (GenaiModel, LiveProcessor)
- Standard Gemini pricing tiers apply
- No additional processing fees from the library itself

---

## Next.js Integration

**No official Next.js integration exists.** The library is Python-only.

Potential integration approaches:
1. **API Route** — Wrap genai-processors in a Next.js API route (`app/api/.../route.ts`)
2. **Server Actions** — Call Python backend via server actions
3. **Edge Functions** — Python runtime (if supported) or proxy to Python service
4. **WebSocket** — Stream results to Next.js client via WebSocket backend

The library's streaming capabilities (async generators) align well with Server-Sent Events (SSE) or WebSocket patterns.

---

## Comparison: genai-processors vs Direct Gemini API Calls

| Aspect | genai-processors | Direct Gemini API |
|--------|------------------|-------------------|
| **Setup** | `pip install genai-processors` | `pip install google-genai` |
| **Content handling** | Unified `ProcessorPart` model | Manual `Part` construction |
| **Streaming** | Built-in, async-native | Available but requires more code |
| **Parallelism** | `//` operator for parallel execution | Manual asyncio/gather |
| **Chaining** | `+` operator for sequential | Manual function composition |
| **Type safety** | Rich types with metadata | Basic types |
| **Learning curve** | New abstraction layer | Direct API familiarity |
| **Flexibility** | Opinionated patterns | Full control |
| **Bundle size** | Additional dependency | Minimal |

### When to Use genai-processors

**Use it when:**
- Building complex multi-step AI pipelines
- Processing heterogeneous content (text + images + audio)
- Need built-in streaming for real-time applications
- Want consistent patterns across different Gemini models

**Use direct API when:**
- Simple single-call use cases
- Need full API flexibility
- Minimizing dependencies
- Performance-critical paths where abstraction overhead matters

---

## Installation

```bash
pip install genai-processors
```

**Requirements:**
- Python >= 3.11
- `google-genai` package (peer dependency)

**Extras:**
```bash
pip install genai-processors[contrib]  # Community processors
pip install genai-processors[dev]      # Development tools
```

---

## Resources

| Resource | URL |
|----------|-----|
| Documentation | https://google-gemini.github.io/genai-processors/ |
| GitHub Repo | https://github.com/google-gemini/genai-processors |
| PyPI | https://pypi.org/project/genai-processors/ |
| Colab: Processor Intro | Content API Intro, Processor basics, Custom processors, Live API |
| Code Generation Guide | `llms.txt` (bundled with library) |

---

## Summary

GenAI Processors provides a well-architected abstraction layer for Gemini APIs with strong async/parallelism support. It's ideal for building composable AI pipelines but adds an abstraction layer that may not suit simple use cases. Video support is implicit through image processing capabilities. Next.js integration requires a backend proxy pattern since the library is Python-only.

---

*Research completed: 2026-04-12*
