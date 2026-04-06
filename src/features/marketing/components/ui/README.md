# ui

Shared UI primitives used across multiple components. Provides reusable, directionally-aware icon components and other base elements.

| File | Purpose |
|------|---------|
| `ChevronIcon.tsx` | Canonical chevron icon with directional prop (up/down/left/right) |

## Usage

```tsx
import ChevronIcon from '@/components/ui/ChevronIcon';

<ChevronIcon direction="down" size={20} className="custom-class" />
```

Props:
- `direction`: 'up' | 'down' | 'left' | 'right' (default: 'down')
- `size`: number in pixels (default: 16)
- `className`: optional CSS class name

## Avoid duplicating

Do not create component-scoped chevron/icon copies. Use this shared primitive instead.
