import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getClientIP = createServerFn({ method: 'GET' }).handler(async () => {
  let clientIP = 'Unknown IP'

  const request = getRequest()
  const ipHeader = request.headers.get('x-forwarded-for') ?? ''
  const ips = ipHeader.split(',').map((ip) => ip.trim())
  if (ips.length > 1) {
    clientIP = ips[ips.length - 1]
  }

  return clientIP
})
