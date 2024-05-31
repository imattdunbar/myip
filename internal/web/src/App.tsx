import { checkPort, getIP } from './api'
import AppState from './store/AppState'
import { useSnapshot } from 'valtio'

function App() {
	const { userPortInput, isPortOpen, userIP, portErrorMessage, checkingPort } = useSnapshot(AppState)

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			doCheck()
		}
	}

	function handleChange(event: any) {
		AppState.userPortInput = event.target.value
	}

	async function doCheck() {
		AppState.isPortOpen = undefined
		AppState.checkingPort = true
		AppState.portErrorMessage = ''
		checkPort(AppState.userPortInput)
			.then((open) => {
				AppState.isPortOpen = open
			})
			.catch((e) => {
				console.log('Error with port:', e)
				AppState.isPortOpen = undefined
				AppState.portErrorMessage = 'Invalid Port'
			})
			.finally(() => {
				AppState.checkingPort = false
			})
	}

	function PortResult() {
		if (isPortOpen !== undefined) {
			if (isPortOpen === true) {
				return <div className="badge badge-success w-32 p-4 text-white font-semibold">Port Open</div>
			} else {
				return <div className="badge badge-error w-32 p-4 text-gray-300 font-semibold">Port Closed</div>
			}
		} else {
			if (checkingPort) {
				return <span className="loading loading-ball loading-lg"></span>
			}

			return <p className="text-red-400 font-medium text-2xl">{portErrorMessage}</p>
		}
	}

	return (
		<>
			<div className="flex flex-col w-full min-h-dvh items-center justify-center bg-slate-900 space-y-6">
				<h1 className="text-4xl lg:text-8xl text-sky-500 font-bold p-2">{userIP}</h1>

				<div className="flex space-x-4">
					<input
						type="text"
						placeholder="Port"
						className="input input-bordered w-36 bg-zinc-800 border-none focus:outline-none text-center placeholder:text-gray-500"
						value={userPortInput}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
					/>
					<button className="btn btn-info text-white" onClick={doCheck}>
						Check
					</button>
				</div>

				<PortResult />
			</div>
		</>
	)
}

export default App
