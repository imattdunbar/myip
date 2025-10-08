import Icons from '@/components/Icons'
import { IPSchema, useCheckPort } from '@/functions/checkPort'
import { getClientIP } from '@/functions/getClientIP'
import UserStore from '@/store/UserStore'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import z from 'zod'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    port: z.number().optional()
  }),
  loader: async () => {
    const clientIP = await getClientIP()
    return { clientIP }
  },
  staleTime: 60 * 1000, // only re-request the client IP every 60 seconds, not every time
  gcTime: 60 * 1000, // await router.invalidate() to re-run the loader manually
  component: RouteComponent
})

function RouteComponent() {
  const { clientIP } = Route.useLoaderData()
  const { port: clientPort } = Route.useSearch()

  const { ip, port, errorMessage, input } = UserStore.use()

  const { portStatus, checkPort, isCheckingPort, clearPortStatus } = useCheckPort()

  const router = useRouter()

  useEffect(() => {
    UserStore.update({ ip: clientIP })
    if (clientPort) {
      UserStore.update({ input: `${clientPort}` })
    }
  }, [])

  async function handleCheck() {
    if (input === '') return

    const newPort = IPSchema.safeParse(input)

    if (newPort.success && newPort.data) {
      UserStore.update({
        errorMessage: undefined,
        port: newPort.data
      })

      // build the new url with the new port search param
      const newLocation = router.buildLocation({
        to: '.',
        search: { port: newPort.data }
      })

      // use replaceState instead of the router navigate here as to not re-run the loaders or affect state
      window.history.replaceState(null, '', newLocation.href)

      await checkPort()
    } else {
      UserStore.update({
        errorMessage: 'Invalid Port'
      })
    }
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="p-2 text-4xl font-bold text-indigo-400 md:text-6xl lg:text-8xl">{ip}</h1>

        <div className="flex items-center gap-3">
          <div className="flex w-48 items-center rounded-lg bg-white/5 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
            <input
              // ref={inputRef}
              value={input}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  UserStore.update({
                    errorMessage: undefined
                  })
                  e.currentTarget.blur()
                }
              }}
              onBlur={async () => {
                await handleCheck()
              }}
              onChange={(e) => {
                UserStore.update({
                  input: e.target.value,
                  errorMessage: undefined
                })
                clearPortStatus()
              }}
              type="text"
              placeholder="Port"
              className="flex w-full bg-transparent px-3 py-2 text-lg font-medium text-white placeholder:text-base placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <button
            className="flex h-full items-center gap-2 rounded-md bg-indigo-500 px-3 py-2 font-semibold text-white hover:bg-indigo-400"
            disabled={isCheckingPort}
            onClick={async () => {
              await handleCheck()
            }}
          >
            {/* {isCheckingPort ? <Icons.LoadingSpinner /> : <h2>Check</h2>} */}

            <h2>Check</h2>
          </button>
        </div>

        <div className="flex h-8 items-center justify-center">
          <div
            className={`transition-opacity duration-400 ${errorMessage || portStatus ? 'opacity-100' : 'opacity-0'}`}
          >
            {errorMessage && (
              <div className="flex items-center gap-1 text-lg font-bold text-red-400">
                <Icons.Error />
                {errorMessage}
              </div>
            )}
            {portStatus === 'Open' && (
              <div className="flex items-center gap-1 text-lg font-bold text-green-400">
                <Icons.CircleCheck />
                Port Open
              </div>
            )}
            {portStatus === 'Closed' && (
              <div className="flex items-center gap-1 text-lg font-bold text-red-400">
                <Icons.CircleX />
                Port Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
