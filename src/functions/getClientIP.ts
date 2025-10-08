import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getClientIP = createServerFn({ method: 'GET' }).handler(async () => {
  let clientIP = 'Unknown IP'
  const request = getRequest()
  const realIP = request.headers.get('x-real-ip')

  if (realIP) {
    clientIP = realIP
  } else {
    const forwarded = request.headers.get('x-forwarded-for') ?? ''
    const ips = forwarded.split(',').map((ip) => ip.trim())
    if (ips.length > 1) {
      clientIP = ips[ips.length - 1]
    }
  }

  // console.log(`REQUEST HEADERS: ${JSON.stringify(request.headers)}`)

  return clientIP
})
