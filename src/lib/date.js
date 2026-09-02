import { format, formatDistanceToNow, isToday, isTomorrow, addMinutes, parseISO } from "date-fns"

export function fmtDate(iso) {
  if (!iso) return "—"
  return format(parseISO(iso), "EEE, MMM d, yyyy")
}

export function fmtDateShort(iso) {
  if (!iso) return "—"
  return format(parseISO(iso), "MMM d, yyyy")
}

export function fmtTime(iso) {
  if (!iso) return "—"
  return format(parseISO(iso), "h:mm a")
}

export function fmtEnd(iso, minutes) {
  if (!iso) return "—"
  const end = addMinutes(parseISO(iso), minutes || 30)
  return format(end, "h:mm a")
}

export function fmtDateTime(iso) {
  if (!iso) return "—"
  return format(parseISO(iso), "MMM d, h:mm a")
}

export function fmtDateTimeFull(iso) {
  if (!iso) return "—"
  return format(parseISO(iso), "EEE, MMM d, yyyy 'at' h:mm a")
}

export function fmtRelative(iso) {
  if (!iso) return ""
  const d = parseISO(iso)
  if (isToday(d)) return "Today"
  if (isTomorrow(d)) return "Tomorrow"
  return format(d, "EEE, MMM d")
}

export function fmtRelativeTime(iso) {
  if (!iso) return ""
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function fmtDayHeader(iso) {
  if (!iso) return ""
  const d = parseISO(iso)
  if (isToday(d)) return "Today"
  if (isTomorrow(d)) return "Tomorrow"
  return format(d, "EEE, MMM d")
}

export function fmtCurrentDate() {
  return format(new Date(), "EEEE, MMMM d, yyyy")
}

export function fmtSlotDate(iso) {
  if (!iso) return ""
  return format(parseISO(iso), "EEE, MMM d")
}
