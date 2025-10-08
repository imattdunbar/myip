import net from 'net'
import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import UserStore from '@/store/UserStore'
import { useQueryClient } from '@tanstack/react-query'

type PortResult = 'Open' | 'Closed'

async function isPortOpen(ip: string, port: number, timeout: number = 500): Promise<PortResult> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(timeout)

    const onConnect = () => {
      socket.destroy()
      resolve('Open')
    }

    const onError = () => {
      socket.destroy()
      resolve('Closed')
    }

    socket.connect(port, ip, onConnect)
    socket.on('error', onError)
    socket.on('timeout', onError)
  })
}

const IPSchema = z.coerce.number().min(0).max(65535)

const UserInputSchema = z.object({
  ip: z.string(),
  port: IPSchema
})

const checkPort = createServerFn({ method: 'POST' })
  .inputValidator(UserInputSchema)
  .handler(async (ctx) => {
    const { ip, port } = ctx.data
    return await isPortOpen(ip, port)
  })

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useCheckPort = () => {
  const queryClient = useQueryClient()

  const queryKey = ['portcheck']

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const userInput = UserStore.current()
      try {
        // await wait(1000)
        const data = UserInputSchema.parse(UserStore.current())
        const result = await checkPort({ data })
        return result
      } catch (e) {
        console.error(`Error checking port: ${JSON.stringify(userInput, null, 2)}`, e)
        return 'Closed'
      }
    },
    retry: false,
    enabled: false // manual trigger of refetch
  })

  const { data, refetch, isFetching, ...rest } = query

  return {
    portStatus: data,
    checkPort: refetch,
    isCheckingPort: isFetching,
    clearPortStatus: () => queryClient.removeQueries({ queryKey }),
    ...rest
  }
}

export { IPSchema }
