import { proxy } from 'valtio'
import { devtools } from 'valtio/utils'

type AppState = {
	userIP: string
	portErrorMessage: string
	userPortInput: string
	isPortOpen?: boolean
}

const initial: AppState = {
	userIP: '',
	portErrorMessage: '',
	userPortInput: '',
	isPortOpen: undefined,
}

const state = proxy(initial)
devtools(state, { name: 'AppState', enabled: true })

export default state
