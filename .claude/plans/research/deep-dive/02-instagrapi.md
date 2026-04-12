# Deep Dive: subzeroid/instagrapi

**Library:** instagrapi | **GitHub:** github.com/subzeroid/instagrapi | **Stars:** ~6.1k
**License:** MIT | **Python:** >= 3.9 | **Companion REST:** instagrapi-rest (598 stars)

---

## 1. Overview

instagrapi is an unofficial Instagram Private API wrapper for Python. It reverse-engineers Instagram's internal mobile and web API endpoints to provide programmatic access without Selenium or browser automation. The maintainer openly notes:

> "The instagrapi more suits for testing or research than a working business!"

The API was last validated against Instagram's live endpoints on **25 May 2025** — reverse-engineered APIs can break without notice when Instagram updates its endpoints.

---

## 2. Capabilities

### Media Upload
- Photo, Video, IGTV, Reels, Albums to feed
- Photo and video to Stories
- Story building with custom backgrounds, fonts, animations, link stickers, user mentions, location stickers, hashtag stickers, giphy stickers

### Media Download
- Posts, Albums, Reels, IGTV, Stories

### Scheduling
- No native scheduling feature. The library provides immediate upload, not delayed posting. Scheduling must be implemented externally (e.g., Celery, APScheduler, cron jobs).

### Analytics / Insights
- Account-level insights
- Per-post insights
- Per-story insights

### Direct Messaging (DMs)
- Send and receive direct messages
- Create threads
- Attach files to messages

### Followers / Following
- List followers and following
- Follow / unfollow users

### Other Social Actions
- Like / unlike posts
- Comment management
- Edit account bio

### Account Management
- TOTP (Google Authenticator) 2FA helpers (generate seed, enable/disable, generate code)
- Challenge resolver (Email/SMS handlers for login verification)
- Proxy management

### Content Discovery
- Public user profiles
- Hashtag data with post lists
- Location data with post lists
- Collections management

---

## 3. REST Companion: instagrapi-rest

**GitHub:** github.com/subzeroid/instagrapi-rest | **Stars:** ~598

Provides a REST API wrapper around instagrapi, enabling access from any language via HTTP.

### Installation

```bash
# Docker (recommended)
docker run -p 8000:8000 subzeroid/instagrapi-rest

# Or local build
git clone https://github.com/subzeroid/instagrapi-rest.git
cd instagrapi-rest
python3 -m venv .venv && . .venv/bin/activate
pip install -U wheel pip -Ur requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Authenticate with username/password (+ optional 2FA code) |
| `/photo/upload_to_story` | POST | Upload photo to story |
| `/photo/upload_to_story/by_url` | POST | Upload photo from URL |
| `/video/upload_to_story` | POST | Upload video to story |
| `/video/upload_to_story/by_url` | POST | Upload video from URL |
| `/user/info/{user_id}` | GET | Get user profile info |
| `/user/followers/{user_id}` | GET | List followers |
| `/user/following/{user_id}` | GET | List following |
| `/media/info/{media_id}` | GET | Get media details |
| `/media/like/{media_id}` | POST | Like a post |
| `/insights/media/{media_id}` | GET | Get post insights |
| `/insights/account` | GET | Get account insights |
| `/docs` | GET | Interactive Swagger UI |

Interactive API docs available at `http://localhost:8000/docs`. OpenAPI spec at `http://localhost:8000/openapi.json`.

### Next.js Integration

**Option A — OpenAPI-generated TypeScript client:**

```bash
npx @openapitools/openapi-generator-cli generate \
  -g typescript-fetch \
  -i http://localhost:8000/openapi.json \
  -o ./lib/instagrapi
```

```typescript
// Then use in Next.js:
import { MediaApi } from '@/lib/instagrapi/api';
const api = new MediaApi('http://localhost:8000');
await api.mediaMediaIdLikePost({ mediaId: '123' });
```

**Option B — Direct fetch:**

```typescript
// Upload by URL
const response = await fetch('http://localhost:8000/photo/upload_to_story/by_url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  body: `sessionid=${sessionId}&url=${encodeURIComponent(imageUrl)}`
});
```

**Option C — Server-side proxy (recommended for security):**

```typescript
// Next.js API route: /pages/api/instagrapi/upload.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionid, url } = req.body;
  const upstream = await fetch('http://localhost:8000/photo/upload_to_story/by_url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams({ sessionid, url })
  });
  res.status(upstream.status).json(await upstream.json());
}
```

**Prerequisites:** ImageMagick must be installed for image processing (`brew install imagemagick` on macOS).

---

## 4. Rate Limits

Rate limit numbers are **not documented** in the official README. What is known:

- The library automatically selects between Web API and Mobile API requests to avoid triggering limits.
- General undocumented community guidance suggests conservative usage (e.g., 1 action per 3-5 seconds minimum, fewer than 100 follows/day, fewer than 350 likes/day).
- Instagram's internal limits change frequently and are not publicly disclosed.
- Proxy rotation is supported as a mitigation strategy.

For production-grade rate limit compliance, the paid **HikerAPI SaaS** (hikerapi.com) is recommended by the maintainer as a commercial alternative.

---

## 5. Anti-Ban Measures

| Technique | Library Support |
|-----------|----------------|
| Web vs Mobile API switching | Built-in, automatic |
| Proxy rotation | Supported via proxy management |
| 2FA challenge handling | Email + SMS handlers built-in |
| TOTP generation | Helpers included |
| Delay between actions | Must be implemented externally (e.g., `time.sleep`) |
| Action randomization | Must be implemented externally |
| Session persistence | Session ID login to reuse authenticated sessions |

**Key warning from maintainer:**
> "It will be difficult to find good accounts, good proxies, or resolve challenges, and IG will ban your accounts."

---

## 6. TOS Risks

This is a significant concern for any production use:

- **Instagram explicitly prohibits** the use of unofficial APIs in its Terms of Service.
- Using instagrapi or instagrapi-rest risks **account suspension or permanent ban** — there is no appeal process.
- Instagram conducts active bot detection on behavioral patterns (rapid follows, identical caption timing, unusual API request signatures).
- The maintainer explicitly disclaims production readiness.
- Instagram has escalated enforcement multiple times, breaking the library mid-2024 and again in late 2024.
- **No legal protection** — using this library is entirely at the user's risk.

**Summary:** Suitable for personal projects, testing, and research. Do not use for client-facing production features without a clear risk acceptance framework.

---

## 7. Data Schemas

### Media

```python
class Media:
    id: str                          # Instagram media ID
    code: str                        # Short code (e.g., "ABC123xyz")
    taken_at: datetime               # Timestamp when taken
    media_type: int                  # 1=Photo, 2=Video, 8=Album, 0=IGTV?
    caption_text: str
    user: UserShort
    location: Optional[Location]
    usertags: List[Usertag]
    num_likes: int
    num_comments: int
    width: int
    height: int
    resources: Optional[List[Resource]]  # For albums
    video_url: Optional[str]         # For videos
    thumbnail_url: Optional[str]
```

### Resource (Album Parts)

```python
class Resource:
    media_id: str
    width: int
    height: int
    url: str
```

### User / Account

```python
class User:
    pk: int                          # Primary key / user ID
    username: str
    full_name: str
    is_private: bool
    profile_pic_url: str
    profile_pic_id: str
    is_verified: bool
    media_count: int                 # Post count
    follower_count: int
    following_count: int
    following_tag_count: int
    biography: str
    external_url: str
    has_anonymous_profile_picture: bool

class Account(User):
    email: str                       # Private info
    phone_number: str                 # Private info
    gender: int
    birth_date: str
```

### Insights

```python
class Insight:
    media_id: str
    reach: int                       # Unique views
    impressions: int                 # Total impressions
    likes: int
    comments: int
    shares: int
    saves: int
    engagement: float               # (likes + comments + saves) / reach
    views: int                       # For video
    swipe_ups: int                   # For stories
```

### Comment

```python
class Comment:
    pk: int
    text: str
    user: UserShort
    created_at: datetime
    likes_count: int
    answers: List[Comment]           # Threaded replies
```

### Direct Thread

```python
class DirectThread:
    thread_id: str
    messages: List[DirectMessage]
    users: List[UserShort]

class DirectMessage:
    id: str
    thread_id: str
    user_id: int
    text: Optional[str]
    media: Optional[Media]           # Photo/video attachments
    timestamp: datetime
```

### Story

```python
class Story:
    id: str
    code: str
    taken_at: datetime
    media_type: int
    user: UserShort
    video_url: Optional[str]
    thumbnail_url: Optional[str]

class StoryBuild:
    path: str                        # Path to built media file
    mentions: List[StoryMention]
```

---

## 8. Installation

```bash
pip install instagrapi
```

**Dependencies:** Python >= 3.9. For media processing, ImageMagick is required.

---

## 9. Quick Usage Example

```python
from instagrapi import Client
from instagrapi.types import Media

cl = Client()
cl.login(username="my_user", password="my_pass")

# Upload a photo
media = cl.photo_upload(
    path="/path/to/photo.jpg",
    caption="Hello from instagrapi!"
)

# Get user profile
user = cl.user_info("instagram")
print(f"@{user.username} has {user.follower_count:,} followers")

# Get post insights
insights = cl.insights_media(media.id)
print(f"Reach: {insights.reach}, Likes: {insights.likes}")

# Send a DM
cl.direct_send("Hello!", user_ids=[user.pk])

# Follow a user
cl.user_follow(user.pk)

# Session reuse (avoid re-login)
import json
cl.login(username="my_user", password="my_pass")
with open("session.json", "w") as f:
    json.dump(cl.session_dumps(), f)

# Later:
with open("session.json") as f:
    cl.session_loads(json.load(f))
```

---

## 10. Summary Table

| Feature | Supported | Native Scheduling | Notes |
|---------|-----------|-------------------|-------|
| Photo upload (feed) | Yes | No | External scheduler needed |
| Video upload (feed/Reels) | Yes | No | |
| Story upload | Yes | No | |
| Album upload | Yes | No | |
| Media download | Yes | — | |
| DM send/receive | Yes | — | |
| Follow/unfollow | Yes | No | Rate limit risk |
| Like/unlike | Yes | No | Rate limit risk |
| Comments | Yes | No | |
| Insights (posts/stories) | Yes | — | |
| Insights (account) | Yes | — | |
| 2FA (TOTP) | Yes | — | |
| Proxy support | Yes | — | |
| REST companion | instagrapi-rest | — | Docker deploy |
| OpenAPI spec | Yes (instagrapi-rest) | — | Generate TS/Python/Go clients |

---

## Sources

- [subzeroid/instagrapi — GitHub](https://github.com/subzeroid/instagrapi)
- [subzeroid/instagrapi-rest — GitHub](https://github.com/subzeroid/instagrapi-rest)
