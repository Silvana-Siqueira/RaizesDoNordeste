import { useLocation } from 'react-router-dom'
import type { Channel } from '../types'

export function useChannel(): Channel {
  const { pathname } = useLocation()
  if (pathname.startsWith('/site')) return 'site'
  if (pathname.startsWith('/totem')) return 'totem'
  if (pathname.startsWith('/balcao')) return 'balcao'
  if (pathname.startsWith('/matriz')) return 'matriz'
  return 'app'
}

export function channelPath(channel: Channel, path = '') {
  const base = channel === 'app' ? '/app' : `/${channel}`
  return `${base}${path}`
}
