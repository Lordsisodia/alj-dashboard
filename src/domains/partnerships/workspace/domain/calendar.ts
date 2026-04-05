export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  location?: string
  type: "office-hours" | "webinar" | "event" | "personal"
}
