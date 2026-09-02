"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, CalendarDays, CheckCheck, Loader2 } from 'lucide-react'
import createClient from '@/lib/supabase/client'
import { fmtDateTime } from '@/lib/date'

export default function NotificationBell({ align = 'right' }) {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const popRef = useRef(null)

  const channelRef = useRef(null)

  // Resolve current user id, load initial notifications, and subscribe in real time.
  useEffect(() => {
    let alive = true

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !alive) return
      setUserId(user.id)

      const { data } = await supabase
        .from('notifications')
        .select('id, type, title, body, link, is_read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      if (alive && data) {
        setNotifications(data)
        setUnread(data.filter((n) => !n.is_read).length)
        setLoaded(true)
      }

      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const n = payload.new
            setNotifications((prev) => [n, ...prev].slice(0, 20))
            setUnread((prev) => prev + 1)
            setLoaded(true)
          }
        )
        .subscribe()
      channelRef.current = channel

      return () => {
        supabase.removeChannel(channel)
      }
    }

    init().catch(() => {})
    return () => {
      alive = false
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [supabase])

  // Close dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function markAllRead() {
    if (!userId || unread === 0) return
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id)
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .in('id', ids)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnread(0)
  }

  async function openNotification(n) {
    setOpen(false)
    if (!n.is_read) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id)
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)))
      setUnread((prev) => Math.max(0, prev - 1))
    }
    if (n.link) router.push(n.link)
  }

  const Icon = ({ type }) =>
    type === 'message' ? (
      <MessageSquare className="w-4 h-4" />
    ) : (
      <CalendarDays className="w-4 h-4" />
    )

  return (
    <div className="relative" ref={popRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] p-2 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 z-50 overflow-hidden ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {!loaded ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    n.is_read ? '' : 'bg-blue-50/60 dark:bg-blue-950/30'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      n.type === 'message'
                        ? 'bg-sky-100 text-sky-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <Icon type={n.type} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {n.title}
                    </span>
                    {n.body && (
                      <span className="block text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {n.body}
                      </span>
                    )}
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {fmtDateTime(n.created_at)}
                    </span>
                  </span>
                  {!n.is_read && (
                    <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
