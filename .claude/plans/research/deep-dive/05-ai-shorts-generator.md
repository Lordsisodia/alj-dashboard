# Deep-Dive: SamurAIGPT/AI-Youtube-Shorts-Generator (3.2k Stars)

**Repository:** https://github.com/SamurAIGPT/AI-Youtube-Shorts-Generator
**Stars:** 3,200+ | **Forks:** 549+
**Generated:** 2026-04-12

---

## 1. Architecture Overview

The tool transforms long-form videos (YouTube URLs or local files) into 9:16 vertical Shorts with AI-selected highlights, auto-subtitles, and smart face/motion-aware cropping.

### Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **AI Analysis** | GPT-4o-mini | Highlight selection via structured output |
| **Transcription** | faster-whisper (base.en) | GPU-accelerated speech-to-text |
| **Video Download** | pytubefix + ffmpeg-python | YouTube download + audio merge |
| **Face Detection** | OpenCV + Haar Cascade | Face location for static crop |
| **Motion Tracking** | OpenCV Farneback optical flow | Action centroid for screen recordings |
| **Video Editing** | MoviePy (wraps FFmpeg) | Clip extraction, subtitle burn |
| **Subtitle Render** | TextClip (ImageMagick) | Styled subtitle bitmap generation |
| **Encoding** | FFmpeg (libx264 / aac) | Final MP4 output |

---

## 2. Video Analysis Pipeline

### 2.1 Pipeline Stages (End-to-End Data Flow)

```
Input (URL / local file)
    │
    ▼
[1] YouTube Download or File Load
    ├─ pytubefix YouTube() → stream selection
    ├─ adaptive stream → separate video + audio
    └─ ffmpeg.merge(video, audio) → .mp4
    │
    ▼
[2] Audio Extraction
    └─ MoviePy VideoFileClip.audio.write_audiofile() → .wav
    │
    ▼
[3] Whisper Transcription
    └─ faster_whisper WhisperModel("base.en")
        ├─ beam_size=5, language="en"
        └─ returns: [[text, start_sec, end_sec], ...]
    │
    ▼
[4] GPT-4o-mini Highlight Selection
    └─ GetHighlight(TransText)
        ├─ System prompt with selection criteria
        └─ Structured JSON output: {start, content, end}
    │
    ▼
[5] User Approval (15s timeout / --auto-approve)
    │
    ▼
[6] Clip Extraction
    └─ MoviePy subclip(start, end) → temp_clip.mp4
    │
    ▼
[7] Smart Vertical Crop
    ├─ Face detected → static crop centered on face
    └─ No face → motion tracking via Farneback optical flow
    │
    ▼
[8] Subtitle Burn
    └─ TextClip → ImageMagick render → FFmpeg overlay
    │
    ▼
[9] Audio Combine
    └─ MoviePy: cropped_video + original_audio → final.mp4
    │
    ▼
[10] Cleanup → output_{slug}_{session_id}_short.mp4
```

---

## 3. GPT-4o-mini Analysis: Prompt Patterns

### 3.1 LanguageTasks.py — Highlight Selection Prompt

The `GetHighlight()` function uses **structured output** via OpenAI function calling:

```python
# Data model (Pydantic)
class JSONResponse(BaseModel):
    start: float      # Clip start time in seconds
    content: str      # Highlight text excerpt
    end: float        # Clip end time in seconds

# Model initialization
ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

# System prompt instructions:
"""
Select a 2-minute segment from the transcription.
Look for content that is:
  - Interesting
  - Useful
  - Surprising
  - Controversial
  - Thought-provoking

Rules:
  - Return complete sentences only (no mid-sentence cuts)
  - Return JSON with: start time, content, end time in seconds
"""
```

### 3.2 Prompt Design Patterns

| Pattern Element | Implementation |
|----------------|----------------|
| **Task framing** | "Select a 2-minute segment" — constrained scope |
| **Quality criteria** | Comma-separated adjectives: interesting, useful, surprising, controversial, thought-provoking |
| **Constraint enforcement** | "Complete sentences only" prevents jarring mid-phrase cuts |
| **Output schema** | Pydantic model forces valid JSON with typed fields |
| **Temperature** | 0.3 — creative enough for selection, deterministic enough for reproducibility |

### 3.3 Adapting for Gemini

To port this to Gemini (e.g., `gemini-2.0-flash`):

```python
# Replace ChatOpenAI with Gemini via langchain-google-genai
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    response_model=JSONResponse  # Gemini doesn't have native function calling in same style
)

# Alternative: use structured output with Gemini's native schema support
llm_with_schema = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    generation_config={
        "response_mime_type": "application/json",
        "response_schema": {
            "type": "object",
            "properties": {
                "start": {"type": "number"},
                "content": {"type": "string"},
                "end": {"type": "number"}
            },
            "required": ["start", "content", "end"]
        }
    }
)
```

**Key adaptation notes:**
- Gemini 2.0 Flash is significantly cheaper than GPT-4o-mini (~1/10th cost)
- Structured output via `generation_config` replaces OpenAI function calling
- Same pipeline architecture applies — only the LLM call changes

---

## 4. FFmpeg Commands Reference

The project uses FFmpeg through three interfaces: **direct CLI** (via ffmpeg-python), **MoviePy** (wrapping FFmpeg), and **ImageMagick** (for subtitle rendering).

### 4.1 Direct FFmpeg (YouTube Download + Merge)

```bash
# Adaptive stream merge (from YoutubeDownloader.py)
ffmpeg -i video.mp4 -i audio.mp4 \
  -vcodec libx264 -acodec aac -strict experimental \
  output.mp4 -y
```

### 4.2 MoviePy Wrapped FFmpeg (Clip Extraction + Encoding)

```python
# Clip extraction (Edit.py — crop_video)
video.subclip(start_time, end_time).write_videofile(
    output_file,
    codec='libx264'       # H.264 video codec
)

# Audio extraction (Edit.py — extractAudio)
video.audio.write_audiofile(audio_path)  # MoviePy wraps FFmpeg internally
```

### 4.3 Subtitle Burn (ImageMagick + FFmpeg Overlay)

```python
# TextClip rendering (Subtitles.py)
txt_clip = TextClip(
    text,
    fontsize=dynamic_fontsize,    # 6.5% of video height
    color='#2699ff',               # Blue text
    stroke_color='black',
    stroke_width=2,
    font='Franklin-Gothic',
    method='caption',
    size=(video.w - 100, None)    # Margined width
)

# Final video encoding (Subtitles.py — add_subtitles_to_video)
video.write_videofile(
    output_video,
    codec='libx264',              # H.264
    audio_codec='aac',            # AAC audio
    fps=video.fps,
    preset='medium',              # Encoding speed vs. quality
    bitrate='3000k'               # 3 Mbps target bitrate
)
```

### 4.4 Key FFmpeg Parameters Summary

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-vcodec` | `libx264` | H.264 encoding (universal compatibility) |
| `-acodec` | `aac` | AAC audio (MP4 standard) |
| `-preset` | `medium` | Balanced encode speed / file size |
| `-bitrate` | `3000k` | 3 Mbps — good quality for 9:16 shorts |
| `-strict experimental` | flag | Required for some aac variants |

---

## 5. OpenCV Processing: Face Detection + Motion Tracking

### 5.1 Face Detection Algorithm (FaceCrop.py)

```python
# Load Haar cascade classifier
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Scan first 30 frames for faces
for frame_idx in range(min(30, total_frames)):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=8,      # High threshold = fewer false positives
        minSize=(30, 30)     # Minimum 30x30 pixel face
    )
    if len(faces) > 0:
        # Take largest face by area
        largest_face = max(faces, key=lambda f: f[2] * f[3])
        face_centers.append((
            largest_face[0] + largest_face[2] // 2,
            largest_face[1] + largest_face[3] // 2
        ))

# Use median for stability (resists outlier frames)
face_center = median(face_centers)
```

**Parameters explained:**
- `minNeighbors=8`: Sensitivity threshold. Higher = fewer false positives, more misses. Default is 3.
- `minSize=(30, 30)`: Minimum face size in pixels. Prevents tiny false detections.
- `scaleFactor=1.1`: How much image is resized each scale. 1.1 is a good balance.

### 5.2 Motion Tracking (Screen Recordings — No Face Detected)

When no face is found (screen recordings, tutorials), the system uses **Farneback optical flow**:

```python
prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)

# Compute optical flow between consecutive frames
flow = cv2.calcOpticalFlowFarneback(
    prev_gray, curr_gray,
    None,
    pyr_scale=0.5,      # Pyramid scale
    levels=3,           # Pyramid levels
    winsize=15,         # Averaging window size
    iterations=3,
    poly_n=5,           # Polynomial expansion size
    poly_sigma=1.2,
    flags=0
)

# Find motion centroid (weighted by magnitude)
# Column-wise sum of motion magnitudes
# Peak column = "where the action is"
```

**Tracking smoothing:**
```python
# Update position once per second (every fps frames)
# 90% previous position + 10% new position (exponential smoothing)
smoothed_x = 0.9 * smoothed_x + 0.1 * new_x
smoothed_y = 0.9 * smoothed_y + 0.1 * new_y
```

### 5.3 Smart Crop Calculation

```python
# Target: 9:16 vertical format
target_width = original_width * 2 // 3   # e.g., 1920 -> 1280
target_height = original_height * 16 // 9  # e.g., 1080 -> 1920

# Face mode: static crop centered on face
crop_x = face_center_x - target_width // 2 + 60  # 60px right offset
crop_y = face_center_y - target_height // 2

# Motion mode: dynamic crop following action
crop_x = smoothed_x - target_width // 2
crop_y = smoothed_y - target_height // 2

# Bounds clamping + letterboxing for edge cases
```

---

## 6. Data Flow: Input to Output Clips

```
URL input
  │
  ▼
pytubefix.YouTube(url)
  ├─ .streams.filter(type="video") → video_stream
  └─ .streams.filter(only_audio=True) → audio_stream
  │
  ▼
Download → videos/video_{timestamp}.mp4 + videos/audio_{timestamp}.mp4
  │
  ▼
ffmpeg.merge(video, audio) → videos/{title}.mp4
  │
  ▼
MoviePy.VideoFileClip → extract audio → audio_{session}.wav
  │
  ▼
faster_whisper.WhisperModel("base.en")
  → list of (text, start_sec, end_sec) tuples
  │
  ▼
Format: "0.0 - 5.5: Hello and welcome to the show..."
  │
  ▼
GPT-4o-mini (GetHighlight)
  → {start: int, content: str, end: int}
  │
  ▼
User approval (or auto-approve)
  │
  ▼
MoviePy.subclip(start, end) → temp_clip_{session}.mp4
  │
  ▼
FaceCrop.crop_to_vertical(temp_clip) → temp_cropped_{session}.mp4
  ├─ Face detected → static centered crop
  └─ No face → Farneback optical flow tracking
  │
  ▼
Subtitles.add_subtitles_to_video(cropped, transcriptions, start)
  ├─ Filter transcriptions to highlight window
  ├─ TextClip per segment (ImageMagick)
  └─ write_videofile with overlay → temp_subtitled_{session}.mp4
  │
  ▼
FaceCrop.combine_videos(cropped, subtitled, final)
  ├─ MoviePy.VideoFileClip(subtitled)
  ├─ MoviePy.VideoFileClip(cropped).audio
  └─ clip.set_audio(audio).write_videofile(final, codec='libx264', audio_codec='aac')
  │
  ▼
Cleanup: delete all temp_* files
  │
  ▼
Output: {slugified_title}_{session_id}_short.mp4
```

---

## 7. Key Configuration Points

| Component | File | Key Settings |
|-----------|------|-------------|
| **LLM Model** | `LanguageTasks.py` | `gpt-4o-mini`, temperature=0.3 |
| **Whisper Model** | `Transcription.py` | `base.en`, beam_size=5 |
| **Subtitle Style** | `Subtitles.py` | `#2699ff`, Franklin-Gothic, 6.5% height |
| **Video Bitrate** | `Subtitles.py` | 3000k, preset=medium |
| **Face Detection** | `FaceCrop.py` | minNeighbors=8, minSize=(30,30) |
| **Motion Smoothing** | `FaceCrop.py` | 90/10 weight split, update 1x/sec |
| **Auto-approve** | `main.py` | 15 second timeout |

---

## 8. Adapting for Gemini: Architecture Recommendations

### 8.1 Replace GPT-4o-mini with Gemini

```python
# In LanguageTasks.py, swap the LLM:
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

class JSONResponse(BaseModel):
    start: float
    content: str
    end: float

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

# Prompt stays the same — Gemini handles the JSON schema inference
prompt = f"""Select a 2-minute segment containing interesting, useful, surprising, controversial, or thought-provoking content. Return complete sentences only.

Transcription:
{TransText}

Return JSON with: start (seconds), content (excerpt), end (seconds)."""
```

### 8.2 Cost Comparison

| Model | Input Cost | Output Cost | Highlight Selection Cost |
|-------|-----------|-------------|--------------------------|
| GPT-4o-mini | $0.15/1M tokens | $0.60/1M tokens | ~$0.001-0.005 per video |
| Gemini 2.0 Flash | $0.10/1M tokens | $0.40/1M tokens | ~$0.0007-0.003 per video |

### 8.3 Pipeline Compatibility

The entire pipeline is LLM-agnostic at the **interface level**:
- Input: plain text transcription
- Output: `{start, content, end}` JSON
- Switching from GPT-4o-mini to Gemini requires only the LLM client swap
- All downstream processing (clip extraction, cropping, subtitles) is unchanged

---

## 9. Extraction Notes

- **Repo:** 3,200+ stars, 549 forks, active maintenance
- **Dependencies:** Python 3.10+, FFmpeg, CUDA (optional), ImageMagick
- **Concurrent execution:** UUID-based session IDs prevent file conflicts
- **Batch mode:** `xargs` with `--auto-approve` flag for URL lists
- **Output naming:** `{slugified_title}_{8-char-uuid}_short.mp4`
- **Error handling:** Graceful exits with diagnostic messages for API/network issues
