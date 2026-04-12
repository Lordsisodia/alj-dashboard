# Integrations Map

*External services required across all dashboards.*

---

## Integration Status

| Integration | Pages That Use It | Status |
|-------------|-------------------|--------|
| Google Sheets | Revenue & ROI, Billings, Shift Tracker (payroll) | Pending — Shaan to provide access |
| Google Drive | Content Requests (auto-upload), Finished Reels (storage) | Pending — folder structure needed |
| Google Gemini | Ideas Lab (video analysis), Finished Reels (AI review) | API key needed |
| Meta API | Content Scheduler (25-slot drip) | Need to research cheap approach |
| Ayrshare | Content Scheduler (multi-platform posting) | Buy decision pending |
| 17 Webcam Platforms | Model Webcam, Agency Webcam Stats | Pending — docs from Shaan |
| TikTok Creative Center | Ideas Lab (trend feed) | Free — can integrate now |
| Telegram | Notifications (high severity) | Bot token needed |
| Instagram API | Agency Social Analytics, Model Social Analytics | Part of Meta API |
| Twitter API | Agency Social Analytics | Separate credentials needed |

---

## Integration Details

### Google Sheets
- Used for financial data (revenue, P&L, payroll rules)
- Sync mechanism: TBD (webhook vs polling)
- Blocking: Agency Revenue & ROI and Shift Tracker cannot be built without this

### Google Drive
- Model recordings upload directly to Drive on submission
- Finished reels stored in Drive before Convex metadata entry
- Folder structure needs to be defined before implementation

### Google Gemini
- Ideas Lab: frame-by-frame video analysis
- Finished Reels: auto-generate caption, title, description, on-screen text extraction
- Reuse `AiAnalysisPanel` component pattern from hub-swipe

### Meta API (Instagram/Facebook)
- Content Scheduler: 25-slot drip queue publishing
- Social Analytics: post stats ingestion
- Research cheapest approach — consider Ayrshare as abstraction layer

### Ayrshare
- Multi-platform social posting abstraction
- Covers Instagram, Twitter, TikTok, and more
- Decision: buy subscription vs direct API integrations

### 17 Webcam Platforms
- Go Live, Webcam Stats (model + agency)
- Platforms: TBD — Shaan to provide list and API docs
- Largest unknown in the system

### TikTok Creative Center
- Ideas Lab trend feed
- Free public API — unblocked, can implement immediately

### Telegram
- High-severity notifications only
- Bot token needed from Shaan
- Trigger: `notifications.severity === 'high'`
