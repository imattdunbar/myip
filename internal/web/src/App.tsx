import { useQuery } from '@tanstack/react-query'
import { checkPort, getIP, queryClient } from './api'
import { useState } from 'react'

function App() {
	const IP_KEY = ['ip']
	const PORT_KEY = ['port']

	const [userPortInput, setUserPortInput] = useState('')

	const ipQuery = useQuery({ queryKey: IP_KEY, queryFn: getIP })

	const portQuery = useQuery({
		queryKey: PORT_KEY,
		queryFn: async () => {
			return await checkPort(userPortInput)
		},
		enabled: false,
		retry: false,
	})

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			doPortCheck()
		}
	}

	function handleChange(event: any) {
		setUserPortInput(event.target.value)
		queryClient.resetQueries({ queryKey: PORT_KEY })
	}

	async function doPortCheck() {
		portQuery.refetch()
	}

	function PortResult() {
		if (!portQuery.isFetched) {
			return
		}
		if (portQuery.isError) {
			return <p className="text-red-400 font-medium text-2xl">{`${portQuery.error}`}</p>
		}
		if (portQuery.isLoading) {
			return <span className="loading loading-ball loading-lg"></span>
		}

		if (portQuery.data) {
			return <div className="badge badge-success w-32 p-4 text-white font-semibold">Port Open</div>
		} else {
			return <div className="badge badge-error w-32 p-4 text-gray-300 font-semibold">Port Closed</div>
		}
	}

	function UserIP() {
		if (ipQuery.isError) {
			return <p className="text-red-600 font-medium text-2xl text-wrap text-center">There was an error getting your IP address</p>
		}
		if (ipQuery.isLoading) {
			return <span className="loading loading-ball loading-lg"></span>
		}

		return <h1 className="text-4xl md:text-6xl lg:text-8xl text-sky-500 font-bold p-2">{ipQuery.data}</h1>
	}

	return (
		<>
			<div className="flex flex-col w-full min-h-dvh items-center justify-center bg-slate-900 space-y-6">
				<UserIP />
				<div className="flex space-x-4">
					<input
						type="text"
						placeholder="Port"
						className="input input-bordered w-36 bg-zinc-800 border-none focus:outline-none text-center placeholder:text-gray-500"
						value={userPortInput}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
					/>
					<button className="btn btn-info text-white" onClick={doPortCheck}>
						Check
					</button>
				</div>

				<PortResult />
			</div>
		</>
	)
}

export default App
