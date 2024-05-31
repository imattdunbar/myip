import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getIP } from './api.ts'
import AppState from './store/AppState.ts'

getIP()
	.then((ip) => {
		AppState.userIP = ip
	})
	.catch((e) => {
		console.log('Error getting IP:', e)
		AppState.userIP = 'Invalid IP'
	})

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
